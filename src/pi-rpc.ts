/**
 * Pi Network RPC Client - Testnet
 * Base SDK para interagir com o servidor RPC do Pi Testnet (Soroban)
 */

const RPC_URL = 'https://rpc.testnet.minepi.com';

export interface RpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: string;
  };
}

export interface HealthStatus {
  status: string;
  latestLedger: number;
  oldestLedger: number;
  ledgerRetentionWindow: number;
}

export interface NetworkInfo {
  passphrase: string;
  protocolVersion: number;
}

export interface LedgerInfo {
  id: string;
  protocolVersion: number;
  sequence: number;
}

export interface FeeStats {
  sorobanInclusionFee: {
    max: string;
    min: string;
    mode: string;
    p10: string;
    p20: string;
    p30: string;
    p40: string;
    p50: string;
    p60: string;
    p70: string;
    p80: string;
    p90: string;
    p95: string;
    p99: string;
    transactionCount: string;
    ledgerCount: number;
  };
  inclusionFee: {
    max: string;
    min: string;
    mode: string;
    p10: string;
    p20: string;
    p30: string;
    p40: string;
    p50: string;
    p60: string;
    p70: string;
    p80: string;
    p90: string;
    p95: string;
    p99: string;
    transactionCount: string;
    ledgerCount: number;
  };
  latestLedger: number;
}

export interface ContractEvent {
  type: string;
  ledger: number;
  ledgerClosedAt: string;
  contractId: string;
  id: string;
  operationIndex: number;
  transactionIndex: number;
  txHash: string;
  inSuccessfulContractCall: boolean;
  topic: string[];
  value: string;
}

export interface EventsResponse {
  events: ContractEvent[];
  cursor: string;
  latestLedger: number;
  oldestLedger: number;
  latestLedgerCloseTime: string;
  oldestLedgerCloseTime: string;
}

export interface Transaction {
  txHash: string;
  ledger: number;
  ledgerClosedAt: string;
  envelope: string;
  result: string;
  history: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  latestLedger: number;
}

export class PiRpcClient {
  private url: string;
  private id: number = 1;

  constructor(url: string = RPC_URL) {
    this.url = url;
  }

  private async call<T>(method: string, params?: Record<string, unknown> | null): Promise<T> {
    const body: Record<string, unknown> = {
      jsonrpc: '2.0',
      id: this.id++,
      method,
    };

    if (params && Object.keys(params).length > 0) {
      body.params = params;
    }

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as RpcResponse<T>;

    if (data.error) {
      throw new Error(`RPC Error ${data.error.code}: ${data.error.message} - ${data.error.data || ''}`);
    }

    if (data.result === undefined) {
      throw new Error('No result in RPC response');
    }

    return data.result;
  }

  /**
   * Verifica a saúde do nó RPC
   */
  async getHealth(): Promise<HealthStatus> {
    return this.call<HealthStatus>('getHealth');
  }

  /**
   * Obtém informações da rede (passphrase e versão do protocolo)
   */
  async getNetwork(): Promise<NetworkInfo> {
    return this.call<NetworkInfo>('getNetwork');
  }

  /**
   * Obtém informações do último ledger
   */
  async getLatestLedger(): Promise<LedgerInfo> {
    return this.call<LedgerInfo>('getLatestLedger');
  }

  /**
   * Estatísticas de taxas da rede
   */
  async getFeeStats(): Promise<FeeStats> {
    return this.call<FeeStats>('getFeeStats');
  }

  /**
   * Obtém eventos de contratos (Soroban)
   * @param startLedger - Ledger inicial para buscar eventos
   * @param type - Tipo de evento (contract, system, etc.)
   * @param limit - Número máximo de eventos
   */
  async getEvents(startLedger: number, type?: string, limit: number = 10): Promise<EventsResponse> {
    const params: Record<string, unknown> = {
      startLedger,
      limit,
    };
    if (type) {
      params.type = type;
    }
    return this.call<EventsResponse>('getEvents', params);
  }

  /**
   * Obtém transações de um ledger específico
   * @param startLedger - Ledger inicial
   * @param limit - Número máximo de transações
   */
  async getTransactions(startLedger: number, limit: number = 10): Promise<TransactionsResponse> {
    return this.call<TransactionsResponse>('getTransactions', { startLedger, limit });
  }

  /**
   * Simula uma transação (sem enviar)
   */
  async simulateTransaction(transaction: string): Promise<unknown> {
    return this.call('simulateTransaction', { transaction });
  }

  /**
   * Envia uma transação para a rede
   */
  async sendTransaction(transaction: string): Promise<unknown> {
    return this.call('sendTransaction', { transaction });
  }

  /**
   * Obtém o estado de uma transação
   */
  async getTransaction(hash: string): Promise<unknown> {
    return this.call('getTransaction', { hash });
  }
}

// Helper para criar cliente com configurações padrão
export function createPiRpcClient(): PiRpcClient {
  return new PiRpcClient();
}

// Exemplo de uso
export async function example() {
  const client = createPiRpcClient();

  console.log('=== Pi Network RPC Testnet ===\n');

  // Verificar saúde
  const health = await client.getHealth();
  console.log('Health:', health);

  // Informações da rede
  const network = await client.getNetwork();
  console.log('Network:', network);

  // Último ledger
  const ledger = await client.getLatestLedger();
  console.log('Latest Ledger:', ledger);

  // Taxas
  const fees = await client.getFeeStats();
  console.log('Fee Stats:', fees.inclusionFee);

  // Eventos recentes
  const events = await client.getEvents(health.latestLedger - 5, 'contract', 5);
  console.log(`Found ${events.events.length} events`);
  
  // Analisar eventos de transferência
  const transferEvents = events.events.filter(e => 
    e.topic[0] === 'AAAADwAAAAh0cmFuc2Zlcg==' // "transfer" em XDR
  );
  console.log(`Transfer events: ${transferEvents.length}`);
}

// Executar exemplo se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  example().catch(console.error);
}
