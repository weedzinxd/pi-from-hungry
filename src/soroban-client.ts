import { createHash } from 'node:crypto';
import { PiRpcClient, ContractEvent } from './pi-rpc.js';

export interface SorobanNetworkConfig {
  rpcUrl: string;
  networkPassphrase: string;
  contractId?: string;
}

export interface InvocationRequest {
  contractId: string;
  method: string;
  args: unknown[];
  sourceAccount?: string;
  fee?: string;
  memo?: string;
}

export interface SignedEnvelopeRequest {
  envelopeXdr: string;
}

export interface InvocationResult {
  contractId: string;
  method: string;
  args: unknown[];
  simulation: unknown;
  xdrPreview: UnsignedEnvelopePreview;
}

export interface SimulationEnvelope {
  contractId: string;
  method: string;
  args: unknown[];
  sourceAccount?: string;
  fee?: string;
  memo?: string;
  networkPassphrase: string;
  mode: 'simulate';
}

export interface PreparedInvokePayload {
  simulationEnvelope: SimulationEnvelope;
  instructions: string[];
}

export interface UnsignedEnvelopePreview {
  envelopeXdr: string;
  envelopeJson: Record<string, unknown>;
  envelopeHash: string;
  note: string;
}

export interface HotspotRegistrationInput {
  caller: string;
  locationHash: string;
  severity: number;
  confidenceBps: number;
  estimatedCostStroops: string;
  evidenceHash: string;
}

export interface DonationInput {
  donor: string;
  hotspotId: number;
  amountStroops: string;
  memoHash: string;
}

export class SorobanClient {
  private readonly rpc: PiRpcClient;
  private readonly network: SorobanNetworkConfig;

  constructor(network: SorobanNetworkConfig) {
    this.network = network;
    this.rpc = new PiRpcClient(network.rpcUrl);
  }

  getRpc(): PiRpcClient {
    return this.rpc;
  }

  getNetworkConfig(): SorobanNetworkConfig {
    return this.network;
  }

  private requireContractId(contractId?: string): string {
    const resolved = contractId ?? this.network.contractId;
    if (!resolved) {
      throw new Error('Missing contractId. Pass one explicitly or configure it in SorobanNetworkConfig.');
    }
    return resolved;
  }

  prepareInvoke(request: InvocationRequest): PreparedInvokePayload {
    const contractId = this.requireContractId(request.contractId);

    return {
      simulationEnvelope: {
        contractId,
        method: request.method,
        args: request.args,
        sourceAccount: request.sourceAccount,
        fee: request.fee,
        memo: request.memo,
        networkPassphrase: this.network.networkPassphrase,
        mode: 'simulate',
      },
      instructions: [
        'Serialize the invocation into the Soroban/Stellar transaction envelope expected by your signer.',
        'Call simulateTransaction first to obtain footprint/resource data.',
        'Rebuild the final transaction with the simulation data applied.',
        'Sign the final envelope off-process or with a secure signer.',
        'Submit using sendSignedEnvelope() and then poll with awaitTransaction().',
      ],
    };
  }

  buildUnsignedEnvelopePreview(request: InvocationRequest): UnsignedEnvelopePreview {
    const contractId = this.requireContractId(request.contractId);
    const envelopeJson = {
      networkPassphrase: this.network.networkPassphrase,
      rpcUrl: this.network.rpcUrl,
      contractId,
      method: request.method,
      args: request.args,
      sourceAccount: request.sourceAccount ?? null,
      fee: request.fee ?? 'auto',
      memo: request.memo ?? null,
      kind: 'unsigned-soroban-envelope-preview',
    };

    const serialized = JSON.stringify(envelopeJson);
    const envelopeXdr = Buffer.from(serialized, 'utf8').toString('base64');
    const envelopeHash = createHash('sha256').update(serialized).digest('hex');

    return {
      envelopeXdr,
      envelopeJson,
      envelopeHash,
      note: 'Preview only. This is not a real signed Stellar/Soroban XDR envelope yet.',
    };
  }

  async simulateInvoke(request: InvocationRequest): Promise<unknown> {
    const payload = this.prepareInvoke(request);
    return this.rpc.simulateTransaction(JSON.stringify(payload.simulationEnvelope));
  }

  async sendSignedEnvelope(request: SignedEnvelopeRequest): Promise<unknown> {
    return this.rpc.sendTransaction(request.envelopeXdr);
  }

  async awaitTransaction(hash: string, maxAttempts = 20, delayMs = 3000): Promise<unknown> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const tx = await this.rpc.getTransaction(hash);
      if (tx) {
        return tx;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(`Transaction ${hash} did not finalize after ${maxAttempts} attempts.`);
  }

  async getContractEvents(startLedger: number, limit = 50, contractId?: string): Promise<ContractEvent[]> {
    const resolvedContractId = this.requireContractId(contractId);
    const response = await this.rpc.getEvents(startLedger, 'contract', limit);
    return response.events.filter((event) => event.contractId === resolvedContractId);
  }

  async getDonation(hotspotId: number, donationIndex: number, contractId?: string): Promise<InvocationResult> {
    const resolvedContractId = this.requireContractId(contractId);
    const args = [hotspotId, donationIndex];
    const request = {
      contractId: resolvedContractId,
      method: 'get_donation',
      args,
    };
    const simulation = await this.simulateInvoke(request);

    return {
      contractId: resolvedContractId,
      method: 'get_donation',
      args,
      simulation,
      xdrPreview: this.buildUnsignedEnvelopePreview(request),
    };
  }

  async registerHotspot(input: HotspotRegistrationInput, contractId?: string): Promise<InvocationResult> {
    const resolvedContractId = this.requireContractId(contractId);
    const args = [
      input.caller,
      input.locationHash,
      input.severity,
      input.confidenceBps,
      input.estimatedCostStroops,
      input.evidenceHash,
    ];

    const request = {
      contractId: resolvedContractId,
      method: 'register_hotspot',
      args,
      sourceAccount: input.caller,
    };
    const simulation = await this.simulateInvoke(request);

    return {
      contractId: resolvedContractId,
      method: 'register_hotspot',
      args,
      simulation,
      xdrPreview: this.buildUnsignedEnvelopePreview(request),
    };
  }

  async donate(input: DonationInput, contractId?: string): Promise<InvocationResult> {
    const resolvedContractId = this.requireContractId(contractId);
    const args = [input.donor, input.hotspotId, input.amountStroops, input.memoHash];
    const request = {
      contractId: resolvedContractId,
      method: 'donate',
      args,
      sourceAccount: input.donor,
    };
    const simulation = await this.simulateInvoke(request);

    return {
      contractId: resolvedContractId,
      method: 'donate',
      args,
      simulation,
      xdrPreview: this.buildUnsignedEnvelopePreview(request),
    };
  }

  async getHotspotSummary(hotspotId: number, contractId?: string): Promise<InvocationResult> {
    const resolvedContractId = this.requireContractId(contractId);
    const args = [hotspotId];
    const request = {
      contractId: resolvedContractId,
      method: 'get_hotspot_summary',
      args,
    };
    const simulation = await this.simulateInvoke(request);

    return {
      contractId: resolvedContractId,
      method: 'get_hotspot_summary',
      args,
      simulation,
      xdrPreview: this.buildUnsignedEnvelopePreview(request),
    };
  }
}

export function createSorobanClientFromEnv(): SorobanClient {
  return new SorobanClient({
    rpcUrl: process.env.SOROBAN_RPC_URL ?? process.env.PI_RPC_URL ?? 'https://rpc.testnet.minepi.com',
    networkPassphrase: process.env.NETWORK_PASSPHRASE ?? 'Pi Testnet',
    contractId: process.env.CONTRACT_ID,
  });
}
