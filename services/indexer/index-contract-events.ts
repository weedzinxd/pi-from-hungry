import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadLatestDeployment } from '../../src/deployment-store.js';
import { PiRpcClient, type ContractEvent } from '../../src/pi-rpc.js';

interface IndexedEvent {
  id: string;
  ledger: number;
  ledgerClosedAt: string;
  contractId: string;
  txHash: string;
  inSuccessfulContractCall: boolean;
  topic: string[];
  value: string;
}

interface IndexedEventsStore {
  contractId: string;
  rpcUrl: string;
  startLedger: number;
  latestLedger: number;
  updatedAt: string;
  events: IndexedEvent[];
}

const rpcUrl = process.env.SOROBAN_RPC_URL ?? process.env.PI_RPC_URL ?? 'https://rpc.testnet.minepi.com';
const dataFile = process.env.INDEXER_OUTPUT_FILE ?? join(process.cwd(), 'data', 'indexed-events.json');

function resolveContractId(): string {
  const deployment = loadLatestDeployment();
  return process.env.CONTRACT_ID ?? deployment?.contractId ?? '';
}

function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function loadStore(contractId: string): IndexedEventsStore {
  if (!existsSync(dataFile)) {
    return {
      contractId,
      rpcUrl,
      startLedger: 0,
      latestLedger: 0,
      updatedAt: new Date(0).toISOString(),
      events: [],
    };
  }

  const raw = JSON.parse(readFileSync(dataFile, 'utf-8')) as IndexedEventsStore;
  return {
    contractId,
    rpcUrl,
    startLedger: raw.startLedger ?? 0,
    latestLedger: raw.latestLedger ?? 0,
    updatedAt: raw.updatedAt ?? new Date(0).toISOString(),
    events: Array.isArray(raw.events) ? raw.events : [],
  };
}

function dedupeAndSort(events: IndexedEvent[]): IndexedEvent[] {
  const unique = new Map<string, IndexedEvent>();
  for (const event of events) {
    unique.set(event.id, event);
  }

  return Array.from(unique.values()).sort((a, b) => b.ledger - a.ledger);
}

function normalizeEvent(event: ContractEvent): IndexedEvent {
  return {
    id: event.id,
    ledger: event.ledger,
    ledgerClosedAt: event.ledgerClosedAt,
    contractId: event.contractId,
    txHash: event.txHash,
    inSuccessfulContractCall: event.inSuccessfulContractCall,
    topic: event.topic,
    value: event.value,
  };
}

async function main() {
  const contractId = resolveContractId();
  if (!contractId) {
    throw new Error('No CONTRACT_ID configured and no deployment record available.');
  }

  const client = new PiRpcClient(rpcUrl);
  const health = await client.getHealth();
  const store = loadStore(contractId);
  const derivedStartLedger = Number(process.argv[2] ?? (store.latestLedger > 0 ? store.latestLedger : Math.max(health.oldestLedger, health.latestLedger - 500)));
  const startLedger = Math.max(health.oldestLedger, derivedStartLedger, 1);
  const limit = Number(process.argv[3] ?? '100');

  const response = await client.getEvents(startLedger, 'contract', limit);
  const contractEvents = response.events.filter((event) => event.contractId === contractId).map(normalizeEvent);
  const events = dedupeAndSort([...contractEvents, ...store.events]);

  const nextStore: IndexedEventsStore = {
    contractId,
    rpcUrl,
    startLedger,
    latestLedger: response.latestLedger,
    updatedAt: new Date().toISOString(),
    events,
  };

  ensureDir(dataFile);
  writeFileSync(dataFile, JSON.stringify(nextStore, null, 2));

  console.log(JSON.stringify({
    contractId,
    rpcUrl,
    startLedger,
    latestLedger: response.latestLedger,
    fetched: contractEvents.length,
    totalIndexed: events.length,
    output: dataFile,
  }, null, 2));
}

main().catch((error) => {
  console.error('❌ indexer failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
