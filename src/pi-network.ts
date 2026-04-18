/**
 * Pi Network Integration Client
 * Conecta com o RPC Testnet e permite interagir com smart contracts
 */

import { PiRpcClient, HealthStatus, NetworkInfo, LedgerInfo, FeeStats, ContractEvent } from './pi-rpc.js';

export class PiNetwork {
  private rpc: PiRpcClient;

  constructor(rpcUrl: string = 'https://rpc.testnet.minepi.com') {
    this.rpc = new PiRpcClient(rpcUrl);
  }

  /**
   * Retorna o cliente RPC para uso direto
   */
  getClient(): PiRpcClient {
    return this.rpc;
  }

  /**
   * Verifica se a rede está operacional
   */
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.rpc.getHealth();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações resumidas da rede
   */
  async getNetworkSummary(): Promise<{
    healthy: boolean;
    network: NetworkInfo | null;
    ledger: LedgerInfo | null;
    fees: FeeStats | null;
  }> {
    const [health, network, ledger, fees] = await Promise.all([
      this.rpc.getHealth(),
      this.rpc.getNetwork(),
      this.rpc.getLatestLedger(),
      this.rpc.getFeeStats(),
    ]);

    return {
      healthy: health.status === 'healthy',
      network,
      ledger,
      fees,
    };
  }

  /**
   * Monitora eventos de um contrato específico
   */
  async watchContract(
    contractId: string,
    fromLedger: number,
    callback: (event: ContractEvent) => void,
    options: { type?: string; timeoutMs?: number } = {}
  ): Promise<{ stop: () => void }> {
    const { type = 'contract', timeoutMs = 60000 } = options;
    let cursor: string | null = null;
    let running = true;
    const startTime = Date.now();

    const poll = async () => {
      while (running && Date.now() - startTime < timeoutMs) {
        try {
          const events = await this.rpc.getEvents(fromLedger, type, 100);
          
          // Filtrar eventos do contrato específico
          const contractEvents = events.events.filter(e => e.contractId === contractId);
          
          for (const event of contractEvents) {
            if (event.id !== cursor) {
              callback(event);
              cursor = event.id;
            }
          }

          if (contractEvents.length > 0) {
            fromLedger = events.latestLedger + 1;
          }

          // Pequeno delay entre polls
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Error polling events:', error);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    };

    poll().catch(console.error);

    return {
      stop: () => {
        running = false;
      },
    };
  }

  /**
   * Decodifica topics de eventos Soroban
   */
  decodeTopics(topics: string[]): Record<string, string> {
    // Tópicos comuns em Soroban (em base64 XDR)
    const topicMap: Record<string, string> = {
      'AAAADwAAAANmZWUA': 'fee',
      'AAAADwAAAAh0cmFuc2Zlcg==': 'transfer',
      'AAAADwAAAAltaW50AAA=': 'mint',
      'AAAADwAAAAlidXJuAAA=': 'burn',
      'AAAADwAAAANnZW5lAAA=': 'gene',
    };

    return topics.map((topic, i) => ({
      [`topic${i}`]: topicMap[topic] || `unknown_${i}`,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  /**
   * Obtém a taxa atual de inclusão
   */
  async getCurrentFee(): Promise<string> {
    const fees = await this.rpc.getFeeStats();
    return fees.inclusionFee.mode;
  }

  /**
   * Estima o tempo até o próximo ledger (~5 segundos)
   */
  async getLedgerCloseTime(): Promise<number> {
    return 5000; // Soroban fecha ledgers aproximadamente a cada 5 segundos
  }
}

// Script de demonstração
export async function demo() {
  const pi = new PiNetwork();

  console.log('🔍 Verificando conexão com Pi Network Testnet...\n');

  // Status da rede
  const summary = await pi.getNetworkSummary();
  
  console.log('✅ Status:', summary.healthy ? 'Saudável' : 'Problemático');
  console.log('📡 Rede:', summary.network?.passphrase);
  console.log('🔗 Protocolo:', `v${summary.network?.protocolVersion}`);
  console.log('📒 Ledger Atual:', summary.ledger?.sequence);
  console.log('💰 Taxa de Inclusão:', summary.fees?.inclusionFee.mode, 'stroops');
  console.log('📊 Transações (últimos 10 ledgers):', summary.fees?.inclusionFee.transactionCount);

  // Listar eventos recentes
  console.log('\n📡 Buscando eventos recentes...\n');
  
  const latestLedger = summary.ledger?.sequence || 0;
  const events = await pi.getClient().getEvents(latestLedger - 10, 'contract', 20);

  // Agrupar por contrato
  const contracts = new Set(events.events.map(e => e.contractId));
  console.log(`🏠 Contratos encontrados: ${contracts.size}`);
  
  contracts.forEach(contractId => {
    const count = events.events.filter(e => e.contractId === contractId).length;
    console.log(`   ${contractId}: ${count} eventos`);
  });

  // Analisar tipos de eventos
  console.log('\n📝 Análise de Eventos:');
  
  const transferTopics = events.events.filter(e => 
    e.topic.some(t => t.includes('dHJhbnNmZXI=')) // "transfer" em base64
  );
  console.log(`   Transferências: ${transferTopics.length}`);

  const feeEvents = events.events.filter(e => 
    e.topic.some(t => t.includes('ZmVl')) // "fee" em base64
  );
  console.log(`   Taxas/Fees: ${feeEvents.length}`);

  console.log('\n✨ Demo completo!');
}

// Executar demo
demo().catch(console.error);
