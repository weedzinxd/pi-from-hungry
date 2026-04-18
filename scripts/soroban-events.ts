import { loadLatestDeployment } from '../src/deployment-store.js';
import { createSorobanClientFromEnv } from '../src/soroban-client.js';

async function main() {
  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const contractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!contractId) {
    throw new Error('No contractId available in env or deployments/latest-deployment.json');
  }

  const startLedger = Number(process.argv[2] ?? '0');
  const limit = Number(process.argv[3] ?? '20');
  const events = await client.getContractEvents(startLedger, limit, contractId);

  console.log(JSON.stringify({ contractId, startLedger, limit, events }, null, 2));
}

main().catch((error) => {
  console.error('❌ soroban events failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
