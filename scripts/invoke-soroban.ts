import { loadLatestDeployment } from '../src/deployment-store.js';
import { createSorobanClientFromEnv } from '../src/soroban-client.js';

async function main() {
  const [method, ...rest] = process.argv.slice(2);

  if (!method) {
    console.log(`
Usage:
  npx tsx scripts/invoke-soroban.ts <method> [json-args]

Examples:
  npx tsx scripts/invoke-soroban.ts get_hotspot_summary '[0]'
  npx tsx scripts/invoke-soroban.ts register_hotspot '["G...","ipfs://loc",7,9500,"10000000","ipfs://evidence"]'
`);
    process.exit(1);
  }

  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const configuredContractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!configuredContractId) {
    throw new Error('No CONTRACT_ID configured and no deployments/latest-deployment.json found.');
  }

  const rawArgs = rest.join(' ').trim();
  const args = rawArgs ? (JSON.parse(rawArgs) as unknown[]) : [];

  const simulation = await client.simulateInvoke({
    contractId: configuredContractId,
    method,
    args,
  });

  console.log(JSON.stringify({
    contractId: configuredContractId,
    method,
    args,
    simulation,
  }, null, 2));
}

main().catch((error) => {
  console.error('❌ invoke failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
