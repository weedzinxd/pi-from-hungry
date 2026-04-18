#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

const IMPACT_MULTIPLIER: i128 = 314_159;
const STROOPS_PER_PI: i128 = 10_000_000;

#[contract]
pub struct HungerReliefAgent;

#[contracttype]
#[derive(Clone, Eq, PartialEq)]
pub enum DataKey {
    Initialized,
    Operator,
    Treasury,
    HotspotCount,
    Hotspot(u32),
    DonationCount(u32),
    Donation(u32, u32),
}

#[contracttype]
#[derive(Clone, Eq, PartialEq, Debug)]
pub struct Hotspot {
    pub id: u32,
    pub location_hash: String,
    pub severity: u32,
    pub confidence_bps: u32,
    pub estimated_cost_stroops: i128,
    pub evidence_hash: String,
    pub is_active: bool,
    pub total_donated_stroops: i128,
    pub total_distributed_stroops: i128,
    pub donation_count: u32,
    pub created_at: u64,
    pub resolved_at: u64,
}

#[contracttype]
#[derive(Clone, Eq, PartialEq, Debug)]
pub struct DonationRecord {
    pub donor: Address,
    pub amount_stroops: i128,
    pub impact_units: i128,
    pub timestamp: u64,
    pub hotspot_id: u32,
    pub memo_hash: String,
}

#[contracttype]
#[derive(Clone, Eq, PartialEq, Debug)]
pub struct HotspotSummary {
    pub id: u32,
    pub severity: u32,
    pub confidence_bps: u32,
    pub is_active: bool,
    pub estimated_cost_stroops: i128,
    pub total_donated_stroops: i128,
    pub total_distributed_stroops: i128,
    pub donation_count: u32,
    pub created_at: u64,
    pub resolved_at: u64,
}

fn require_initialized(env: &Env) {
    let initialized = env
        .storage()
        .instance()
        .get::<DataKey, bool>(&DataKey::Initialized)
        .unwrap_or(false);

    if !initialized {
        panic!("contract not initialized");
    }
}

fn require_not_initialized(env: &Env) {
    let initialized = env
        .storage()
        .instance()
        .get::<DataKey, bool>(&DataKey::Initialized)
        .unwrap_or(false);

    if initialized {
        panic!("already initialized");
    }
}

fn read_operator(env: &Env) -> Address {
    env.storage()
        .instance()
        .get::<DataKey, Address>(&DataKey::Operator)
        .unwrap_or_else(|| panic!("operator not set"))
}

fn require_operator(env: &Env, caller: &Address) {
    caller.require_auth();
    let operator = read_operator(env);
    if &operator != caller {
        panic!("only operator");
    }
}

fn read_hotspot(env: &Env, hotspot_id: u32) -> Hotspot {
    env.storage()
        .persistent()
        .get::<DataKey, Hotspot>(&DataKey::Hotspot(hotspot_id))
        .unwrap_or_else(|| panic!("hotspot not found"))
}

fn write_hotspot(env: &Env, hotspot: &Hotspot) {
    env.storage()
        .persistent()
        .set(&DataKey::Hotspot(hotspot.id), hotspot);
}

fn require_valid_severity(severity: u32) {
    if !(1..=10).contains(&severity) {
        panic!("severity must be 1..10");
    }
}

fn require_valid_confidence(confidence_bps: u32) {
    if confidence_bps > 10_000 {
        panic!("confidence_bps must be <= 10000");
    }
}

fn require_positive_amount(amount: i128) {
    if amount <= 0 {
        panic!("amount must be positive");
    }
}

fn impact_units_from_stroops(amount_stroops: i128) -> i128 {
    (amount_stroops * IMPACT_MULTIPLIER) / STROOPS_PER_PI
}

#[contractimpl]
impl HungerReliefAgent {
    pub fn init(env: Env, operator: Address, treasury: Address) {
        require_not_initialized(&env);
        operator.require_auth();

        env.storage().instance().set(&DataKey::Operator, &operator);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::HotspotCount, &0u32);
        env.storage().instance().set(&DataKey::Initialized, &true);

        env.events()
            .publish((symbol_short!("init"), operator.clone()), treasury);
    }

    pub fn get_operator(env: Env) -> Address {
        require_initialized(&env);
        read_operator(&env)
    }

    pub fn get_treasury(env: Env) -> Address {
        require_initialized(&env);
        env.storage()
            .instance()
            .get::<DataKey, Address>(&DataKey::Treasury)
            .unwrap_or_else(|| panic!("treasury not set"))
    }

    pub fn get_hotspot_count(env: Env) -> u32 {
        require_initialized(&env);
        env.storage()
            .instance()
            .get::<DataKey, u32>(&DataKey::HotspotCount)
            .unwrap_or(0)
    }

    pub fn register_hotspot(
        env: Env,
        caller: Address,
        location_hash: String,
        severity: u32,
        confidence_bps: u32,
        estimated_cost_stroops: i128,
        evidence_hash: String,
    ) -> u32 {
        require_initialized(&env);
        require_operator(&env, &caller);
        require_valid_severity(severity);
        require_valid_confidence(confidence_bps);
        require_positive_amount(estimated_cost_stroops);

        let hotspot_id = Self::get_hotspot_count(env.clone());
        let hotspot = Hotspot {
            id: hotspot_id,
            location_hash: location_hash.clone(),
            severity,
            confidence_bps,
            estimated_cost_stroops,
            evidence_hash: evidence_hash.clone(),
            is_active: true,
            total_donated_stroops: 0,
            total_distributed_stroops: 0,
            donation_count: 0,
            created_at: env.ledger().timestamp(),
            resolved_at: 0,
        };

        write_hotspot(&env, &hotspot);
        env.storage()
            .instance()
            .set(&DataKey::HotspotCount, &(hotspot_id + 1));
        env.storage()
            .instance()
            .set(&DataKey::DonationCount(hotspot_id), &0u32);

        env.events().publish(
            (symbol_short!("hs_reg"), hotspot_id),
            (location_hash, severity, confidence_bps, evidence_hash),
        );

        hotspot_id
    }

    pub fn donate(
        env: Env,
        donor: Address,
        hotspot_id: u32,
        amount_stroops: i128,
        memo_hash: String,
    ) -> i128 {
        require_initialized(&env);
        donor.require_auth();
        require_positive_amount(amount_stroops);

        let mut hotspot = read_hotspot(&env, hotspot_id);
        if !hotspot.is_active {
            panic!("hotspot not active");
        }

        let donation_index = env
            .storage()
            .instance()
            .get::<DataKey, u32>(&DataKey::DonationCount(hotspot_id))
            .unwrap_or(0);

        let impact_units = impact_units_from_stroops(amount_stroops);
        let donation = DonationRecord {
            donor: donor.clone(),
            amount_stroops,
            impact_units,
            timestamp: env.ledger().timestamp(),
            hotspot_id,
            memo_hash: memo_hash.clone(),
        };

        hotspot.total_donated_stroops += amount_stroops;
        hotspot.donation_count += 1;
        write_hotspot(&env, &hotspot);

        env.storage()
            .persistent()
            .set(&DataKey::Donation(hotspot_id, donation_index), &donation);
        env.storage()
            .instance()
            .set(&DataKey::DonationCount(hotspot_id), &(donation_index + 1));

        env.events().publish(
            (symbol_short!("donate"), hotspot_id, donor),
            (amount_stroops, impact_units, memo_hash),
        );

        impact_units
    }

    pub fn distribute_aid(
        env: Env,
        caller: Address,
        hotspot_id: u32,
        amount_stroops: i128,
        proof_hash: String,
    ) {
        require_initialized(&env);
        require_operator(&env, &caller);
        require_positive_amount(amount_stroops);

        let mut hotspot = read_hotspot(&env, hotspot_id);
        if !hotspot.is_active {
            panic!("hotspot not active");
        }

        hotspot.total_distributed_stroops += amount_stroops;
        write_hotspot(&env, &hotspot);

        env.events().publish(
            (symbol_short!("aid_out"), hotspot_id),
            (amount_stroops, proof_hash),
        );
    }

    pub fn resolve_hotspot(env: Env, caller: Address, hotspot_id: u32) {
        require_initialized(&env);
        require_operator(&env, &caller);

        let mut hotspot = read_hotspot(&env, hotspot_id);
        if !hotspot.is_active {
            panic!("hotspot already resolved");
        }

        hotspot.is_active = false;
        hotspot.resolved_at = env.ledger().timestamp();
        write_hotspot(&env, &hotspot);

        env.events()
            .publish((symbol_short!("resolve"), hotspot_id), hotspot.resolved_at);
    }

    pub fn emergency_trigger(
        env: Env,
        caller: Address,
        location_hash: String,
        severity: u32,
        evidence_hash: String,
    ) -> u32 {
        require_initialized(&env);
        require_operator(&env, &caller);
        require_valid_severity(severity);

        let hotspot_id = Self::register_hotspot(
            env.clone(),
            caller,
            location_hash,
            severity,
            10_000,
            1,
            evidence_hash,
        );

        env.events()
            .publish((symbol_short!("emerg"), hotspot_id), severity);

        hotspot_id
    }

    pub fn get_hotspot(env: Env, hotspot_id: u32) -> Hotspot {
        require_initialized(&env);
        read_hotspot(&env, hotspot_id)
    }

    pub fn get_hotspot_summary(env: Env, hotspot_id: u32) -> HotspotSummary {
        require_initialized(&env);
        let hotspot = read_hotspot(&env, hotspot_id);

        HotspotSummary {
            id: hotspot.id,
            severity: hotspot.severity,
            confidence_bps: hotspot.confidence_bps,
            is_active: hotspot.is_active,
            estimated_cost_stroops: hotspot.estimated_cost_stroops,
            total_donated_stroops: hotspot.total_donated_stroops,
            total_distributed_stroops: hotspot.total_distributed_stroops,
            donation_count: hotspot.donation_count,
            created_at: hotspot.created_at,
            resolved_at: hotspot.resolved_at,
        }
    }

    pub fn get_donation_count(env: Env, hotspot_id: u32) -> u32 {
        require_initialized(&env);
        env.storage()
            .instance()
            .get::<DataKey, u32>(&DataKey::DonationCount(hotspot_id))
            .unwrap_or(0)
    }

    pub fn get_donation(env: Env, hotspot_id: u32, donation_index: u32) -> DonationRecord {
        require_initialized(&env);
        env.storage()
            .persistent()
            .get::<DataKey, DonationRecord>(&DataKey::Donation(hotspot_id, donation_index))
            .unwrap_or_else(|| panic!("donation not found"))
    }
}

#[cfg(test)]
extern crate std;

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address};

    fn setup() -> (Env, Address, Address, HungerReliefAgentClient<'static>) {
        let env = Env::default();
        let contract_id = env.register(HungerReliefAgent, ());
        let client = HungerReliefAgentClient::new(&env, &contract_id);
        let operator = Address::generate(&env);
        let treasury = Address::generate(&env);

        client.init(&operator, &treasury);

        (env, operator, treasury, client)
    }

    #[test]
    fn register_and_read_hotspot() {
        let (env, operator, _treasury, client) = setup();
        let location_hash = String::from_str(&env, "ipfs://location-proof");
        let evidence_hash = String::from_str(&env, "ipfs://evidence-proof");

        let hotspot_id = client.register_hotspot(
            &operator,
            &location_hash,
            &7,
            &9_500,
            &50_000_000i128,
            &evidence_hash,
        );

        assert_eq!(hotspot_id, 0);
        assert_eq!(client.get_hotspot_count(), 1);

        let hotspot = client.get_hotspot(&hotspot_id);
        assert_eq!(hotspot.id, 0);
        assert_eq!(hotspot.severity, 7);
        assert_eq!(hotspot.confidence_bps, 9_500);
        assert!(hotspot.is_active);
    }

    #[test]
    fn donate_updates_summary() {
        let (env, operator, _treasury, client) = setup();
        let donor = Address::generate(&env);
        let location_hash = String::from_str(&env, "ipfs://location-proof");
        let evidence_hash = String::from_str(&env, "ipfs://evidence-proof");
        let memo_hash = String::from_str(&env, "ipfs://memo-proof");

        let hotspot_id = client.register_hotspot(
            &operator,
            &location_hash,
            &8,
            &8_800,
            &90_000_000i128,
            &evidence_hash,
        );

        let impact_units = client.donate(&donor, &hotspot_id, &10_000_000i128, &memo_hash);
        assert_eq!(impact_units, 314_159);

        let summary = client.get_hotspot_summary(&hotspot_id);
        assert_eq!(summary.total_donated_stroops, 10_000_000);
        assert_eq!(summary.donation_count, 1);

        let donation = client.get_donation(&hotspot_id, &0);
        assert_eq!(donation.amount_stroops, 10_000_000);
        assert_eq!(donation.impact_units, 314_159);
    }
}
