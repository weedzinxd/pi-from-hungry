import { loadLatestDeployment } from '../src/deployment-store.js';
import { createSorobanClientFromEnv } from '../src/soroban-client.js';

async function main() {
  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const contractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!contractId) throw new Error('No contractId available in env or deployments/latest-deployment.json');

  const method = process.argv[2] ?? 'get_hotspot_summary';
  const args = process.argv[3] ? (JSON.parse(process.argv[3]) as unknown[]) : [0];
  const preview = client.buildUnsignedEnvelopePreview({
    contractId,
    method,
    args,
  });

  console.log(JSON.stringify(preview, null, 2));
}

main().catch((error) => {
  console.error('❌ soroban xdr preview failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
