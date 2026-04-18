import { loadLatestDeployment } from '../src/deployment-store.js';
import { createSorobanClientFromEnv } from '../src/soroban-client.js';

async function main() {
  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const contractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!contractId) throw new Error('No contractId available in env or deployments/latest-deployment.json');

  const donor = process.env.DONOR_ADDRESS ?? process.argv[2];
  if (!donor) throw new Error('Provide DONOR_ADDRESS in .env or pass donor as first argument.');

  const result = await client.donate(
    {
      donor,
      hotspotId: Number(process.argv[3] ?? '0'),
      amountStroops: process.argv[4] ?? '10000000',
      memoHash: process.argv[5] ?? 'ipfs://demo-donation-memo',
    },
    contractId,
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error('❌ soroban donate simulation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
