/**
 * Pi Network SDK - Cliente Completo
 * Integração com o RPC Testnet do Pi Network
 */

import { PiRpcClient } from './pi-rpc.js';

export class PiClient {
  private rpc: PiRpcClient;
  private contractCache: Map<string, ContractInfo> = new Map();

  constructor(rpcUrl: string = 'https://rpc.testnet.minepi.com') {
    this.rpc = new PiRpcClient(rpcUrl);
  }

  /**
   * Retorna o cliente RPC para operações avançadas
   */
  getRpc(): PiRpcClient {
    return this.rpc;
  }

  /**
   * Verifica a conexão com a rede
   */
  async ping(): Promise<boolean> {
    try {
      const health = await this.rpc.getHealth();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações completas do ledger atual
   */
  async getLedgerInfo() {
    const health = await this.rpc.getHealth();
    const ledger = await this.rpc.getLatestLedger();
    const network = await this.rpc.getNetwork();
    const fees = await this.rpc.getFeeStats();

    return {
      health,
      ledger,
      network,
      fees,
      ledgerTime: new Date().toISOString(),
    };
  }

  /**
   * Escaneia eventos de transferência
   */
  async getTransfers(fromLedger: number, limit: number = 100) {
    const events = await this.rpc.getEvents(fromLedger, 'contract', limit);
    
    const transfers: Transfer[] = [];
    
    for (const event of events.events) {
      // Verificar se é evento de transferência (topic[0] contém "transfer")
      const topic0Decoded = Buffer.from(event.topic[0], 'base64').toString('utf8');
      
      if (topic0Decoded.includes('transfer')) {
        transfers.push({
          txHash: event.txHash,
          contractId: event.contractId,
          ledger: event.ledger,
          timestamp: event.ledgerClosedAt,
          topics: event.topic.map(t => Buffer.from(t, 'base64').toString('utf8').trim()),
          value: Buffer.from(event.value, 'base64').toString('hex'),
          successful: event.inSuccessfulContractCall,
        });
      }
    }

    return {
      transfers,
      total: transfers.length,
      latestLedger: events.latestLedger,
    };
  }

  /**
   * Monitora um contrato em tempo real
   */
  async watchContract(
    contractId: string,
    fromLedger: number,
    onTransfer: (transfer: Transfer) => void
  ) {
    let cursor = '';
    let lastLedger = fromLedger;

    const poll = async () => {
      try {
        const events = await this.rpc.getEvents(lastLedger, 'contract', 100);
        
        for (const event of events.events) {
          if (event.contractId !== contractId) continue;
          if (event.id === cursor) continue;

          const topic0Decoded = Buffer.from(event.topic[0], 'base64').toString('utf8');
          
          if (topic0Decoded.includes('transfer')) {
            onTransfer({
              txHash: event.txHash,
              contractId: event.contractId,
              ledger: event.ledger,
              timestamp: event.ledgerClosedAt,
              topics: event.topic.map(t => Buffer.from(t, 'base64').toString('utf8').trim()),
              value: Buffer.from(event.value, 'base64').toString('hex'),
              successful: event.inSuccessfulContractCall,
            });
          }

          cursor = event.id;
          lastLedger = Math.max(lastLedger, event.ledger);
        }
      } catch (error) {
        console.error('Watch error:', error);
      }
    };

    // Poll inicial
    await poll();

    // Polling contínuo
    return setInterval(poll, 5000);
  }

  /**
   * Analisa a atividade de um contrato
   */
  async analyzeContract(contractId: string, fromLedger: number, toLedger: number) {
    const events = await this.rpc.getEvents(fromLedger, 'contract', 1000);
    
    const contractEvents = events.events.filter(e => e.contractId === contractId);
    
    const stats = {
      totalEvents: contractEvents.length,
      successfulCalls: contractEvents.filter(e => e.inSuccessfulContractCall).length,
      failedCalls: contractEvents.filter(e => !e.inSuccessfulContractCall).length,
      transfers: 0,
      byTopic: {} as Record<string, number>,
      uniqueTransactions: new Set(contractEvents.map(e => e.txHash)).size,
      ledgerRange: {
        from: Math.min(...contractEvents.map(e => e.ledger)),
        to: Math.max(...contractEvents.map(e => e.ledger)),
      },
    };

    for (const event of contractEvents) {
      const topic0Decoded = Buffer.from(event.topic[0], 'base64').toString('utf8').trim();
      const topicKey = topic0Decoded || 'unknown';
      stats.byTopic[topicKey] = (stats.byTopic[topicKey] || 0) + 1;
      
      if (topic0Decoded.includes('transfer')) {
        stats.transfers++;
      }
    }

    return stats;
  }
}

interface ContractInfo {
  id: string;
  name?: string;
  firstSeen: number;
}

interface Transfer {
  txHash: string;
  contractId: string;
  ledger: number;
  timestamp: string;
  topics: string[];
  value: string;
  successful: boolean;
}

// ============= CLI =============

async function cli() {
  const args = process.argv.slice(2);
  const client = new PiClient();

  if (args[0] === 'ping') {
    console.log('🔍 Verificando conexão...');
    const ok = await client.ping();
    console.log(ok ? '✅ Conectado!' : '❌ Falha na conexão');
  } 
  else if (args[0] === 'status') {
    console.log('📊 Status da Rede:\n');
    const info = await client.getLedgerInfo();
    console.log(JSON.stringify(info, null, 2));
  }
  else if (args[0] === 'transfers') {
    const health = await client.getRpc().getHealth();
    const fromLedger = parseInt(args[1]) || (health.latestLedger - 100);
    console.log(`📡 Buscando transfers do ledger ${fromLedger}...\n`);
    
    const result = await client.getTransfers(fromLedger);
    console.log(`Encontrados ${result.total} transfers:\n`);
    result.transfers.slice(0, 10).forEach((t, i) => {
      console.log(`${i + 1}. TX: ${t.txHash.slice(0, 20)}...`);
      console.log(`   Contrato: ${t.contractId.slice(0, 20)}...`);
      console.log(`   Ledger: ${t.ledger}`);
      console.log(`   Value: ${t.value}`);
      console.log('');
    });
  }
  else if (args[0] === 'watch') {
    const contractId = args[1];
    if (!contractId) {
      console.error('Uso: pi-client watch <contractId>');
      process.exit(1);
    }
    
    const health = await client.getRpc().getHealth();
    console.log(`👁️  Monitorando contrato ${contractId}\n`);
    console.log('Pressione Ctrl+C para parar\n');
    
    client.watchContract(contractId, health.latestLedger - 50, (transfer) => {
      console.log('🆕 Nova Transferência:');
      console.log(`   TX: ${transfer.txHash}`);
      console.log(`   Value: ${transfer.value}`);
      console.log(`   Ledger: ${transfer.ledger}`);
      console.log('');
    });
  }
  else {
    console.log(`
Pi Network SDK Client
=====================

Uso: npx tsx src/client.ts <comando> [opções]

Comandos:
  ping              - Verifica conexão com a rede
  status            - Mostra informações do ledger atual
  transfers [from]  - Lista transfers recentes (default: últimos 100 ledgers)
  watch <contract>  - Monitora um contrato em tempo real

Exemplos:
  npx tsx src/client.ts ping
  npx tsx src/client.ts status
  npx tsx src/client.ts transfers 23981500
  npx tsx src/client.ts watch CDG6ZM2SHXIHD5HZ2E62B7D76RY5DUHDNQVPSHRVDNN7W4EW47FXLEXQ
`);
  }
}

cli().catch(console.error);
