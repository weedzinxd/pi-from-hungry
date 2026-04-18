import { loadLatestDeployment } from '../src/deployment-store.js';
import { createSorobanClientFromEnv } from '../src/soroban-client.js';

async function main() {
  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const contractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!contractId) throw new Error('No contractId available in env or deployments/latest-deployment.json');

  const hotspotId = Number(process.argv[2] ?? '0');
  const donationIndex = Number(process.argv[3] ?? '0');
  const result = await client.getDonation(hotspotId, donationIndex, contractId);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error('❌ soroban get donation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
