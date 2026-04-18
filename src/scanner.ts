/**
 * Pi Network Event Scanner
 * Monitora e analiza eventos de smart contracts na rede Pi Testnet
 */

import { PiNetwork } from './pi-network.js';

const pi = new PiNetwork();

// Configuração
const POLL_INTERVAL = 5000; // 5 segundos
const EVENTS_PER_POLL = 50;

interface EventStats {
  total: number;
  byContract: Record<string, number>;
  byType: Record<string, number>;
  lastLedger: number;
}

async function analyzeEvent(event: any): Promise<string> {
  const topics = event.topic;
  
  // Decodificar topics em texto legível (busca por padrão)
  const topic0 = Buffer.from(topics[0], 'base64').toString('utf8').replace(/\x00/g, '');
  
  // Identificar tipo de evento
  if (topic0.includes('transfer') || event.txHash.includes('dHJh')) {
    return 'transfer';
  }
  if (topic0.includes('fee') || topics.some((t: string) => Buffer.from(t, 'base64').toString().includes('fee'))) {
    return 'fee';
  }
  if (topic0.includes('mint')) {
    return 'mint';
  }
  if (topic0.includes('burn')) {
    return 'burn';
  }
  
  return 'unknown';
}

async function scanEvents(fromLedger: number, limit: number = 100) {
  console.log(`\n🔍 Escaneando ledgers ${fromLedger} a ${fromLedger + limit}...\n`);
  
  const stats: EventStats = {
    total: 0,
    byContract: {},
    byType: {},
    lastLedger: fromLedger,
  };

  try {
    const events = await pi.getClient().getEvents(fromLedger, 'contract', limit);
    
    for (const event of events.events) {
      stats.total++;
      stats.lastLedger = Math.max(stats.lastLedger, event.ledger);
      
      // Contar por contrato
      stats.byContract[event.contractId] = (stats.byContract[event.contractId] || 0) + 1;
      
      // Analisar tipo
      const type = await analyzeEvent(event);
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    }

    // Mostrar resultados
    console.log('📊 Estatísticas:');
    console.log(`   Total de eventos: ${stats.total}`);
    console.log(`   Último ledger: ${stats.lastLedger}`);
    
    console.log('\n🏠 Por Contrato:');
    for (const [contract, count] of Object.entries(stats.byContract)) {
      console.log(`   ${contract.slice(0, 20)}...: ${count}`);
    }
    
    console.log('\n📝 Por Tipo:');
    for (const [type, count] of Object.entries(stats.byType)) {
      console.log(`   ${type}: ${count}`);
    }

    // Mostrar transações recentes
    console.log('\n💾 Transações Recentes:');
    const uniqueTxs = [...new Set(events.events.map(e => e.txHash))].slice(0, 5);
    for (const tx of uniqueTxs) {
      console.log(`   ${tx.slice(0, 30)}...`);
    }

    return stats;
  } catch (error) {
    console.error('Erro ao escanear:', error);
    throw error;
  }
}

async function monitorContinuously(startLedger: number) {
  console.log('🚀 Monitoramento Contínuo de Eventos Pi Network\n');
  console.log('Pressione Ctrl+C para parar\n');

  let currentLedger = startLedger;
  
  // Executar scan inicial
  await scanEvents(currentLedger);

  // Loop de monitoramento
  setInterval(async () => {
    try {
      const health = await pi.getClient().getHealth();
      if (health.latestLedger > currentLedger) {
        console.log(`\n🆕 Novos ledgers detectados: ${currentLedger} -> ${health.latestLedger}`);
        await scanEvents(currentLedger + 1, 20);
        currentLedger = health.latestLedger;
      }
    } catch (error) {
      console.error('Erro no monitoramento:', error);
    }
  }, POLL_INTERVAL);
}

async function main() {
  const args = process.argv.slice(2);
  
  // Obter ledger atual
  const health = await pi.getClient().getHealth();
  const latestLedger = health.latestLedger;

  if (args.includes('--monitor')) {
    // Modo monitoramento contínuo
    const fromLedger = parseInt(args[args.indexOf('--monitor') + 1]) || (latestLedger - 100);
    await monitorContinuously(fromLedger);
  } else if (args.includes('--scan')) {
    // Scan único
    const fromLedger = parseInt(args[args.indexOf('--scan') + 1]) || (latestLedger - 100);
    await scanEvents(fromLedger);
  } else {
    // Default: scan único dos últimos eventos
    console.log('📡 Pi Network Event Scanner\n');
    await scanEvents(latestLedger - 50, 50);
  }
}

main().catch(console.error);
