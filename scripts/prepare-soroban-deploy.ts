import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { saveLatestDeployment } from '../src/deployment-store.js';

function main() {
  const wasmPath = join(process.cwd(), 'contracts', 'target', 'wasm32-unknown-unknown', 'release', 'hunger_relief_agent.wasm');
  const optimizedWasmPath = join(process.cwd(), 'contracts', 'target', 'wasm32-unknown-unknown', 'release', 'hunger_relief_agent.optimized.wasm');

  console.log('🔍 Soroban deployment preflight\n');
  console.log(`WASM: ${existsSync(wasmPath) ? 'FOUND' : 'MISSING'} -> ${wasmPath}`);
  console.log(`Optimized WASM: ${existsSync(optimizedWasmPath) ? 'FOUND' : 'MISSING'} -> ${optimizedWasmPath}`);
  console.log(`Operator: ${process.env.OPERATOR_ADDRESS ?? 'MISSING'}`);
  console.log(`Treasury: ${process.env.TREASURY_ADDRESS ?? 'MISSING'}`);
  console.log(`RPC: ${process.env.SOROBAN_RPC_URL ?? process.env.PI_RPC_URL ?? 'https://rpc.testnet.minepi.com'}`);
  console.log(`Passphrase: ${process.env.NETWORK_PASSPHRASE ?? 'Pi Testnet'}`);

  if (process.env.CONTRACT_ID) {
    saveLatestDeployment({
      contractId: process.env.CONTRACT_ID,
      network: process.env.NETWORK_PASSPHRASE ?? 'Pi Testnet',
      rpcUrl: process.env.SOROBAN_RPC_URL ?? process.env.PI_RPC_URL ?? 'https://rpc.testnet.minepi.com',
      networkPassphrase: process.env.NETWORK_PASSPHRASE ?? 'Pi Testnet',
      timestamp: new Date().toISOString(),
    });
    console.log('\n💾 Saved CONTRACT_ID into deployments/latest-deployment.json');
  }
}

main();
