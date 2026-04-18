import { loadLatestDeployment } from '../src/deployment-store.js';
import { createSorobanClientFromEnv } from '../src/soroban-client.js';

async function main() {
  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const contractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!contractId) {
    throw new Error('No contractId available in env or deployments/latest-deployment.json');
  }

  const caller = process.env.OPERATOR_ADDRESS ?? process.argv[2];
  if (!caller) {
    throw new Error('Provide OPERATOR_ADDRESS in .env or pass caller as first argument.');
  }

  const result = await client.registerHotspot(
    {
      caller,
      locationHash: process.argv[3] ?? 'ipfs://demo-location',
      severity: Number(process.argv[4] ?? '7'),
      confidenceBps: Number(process.argv[5] ?? '9500'),
      estimatedCostStroops: process.argv[6] ?? '10000000',
      evidenceHash: process.argv[7] ?? 'ipfs://demo-evidence',
    },
    contractId,
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error('❌ soroban register simulation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
