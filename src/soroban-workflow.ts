import { loadLatestDeployment } from './deployment-store.js';
import { createSorobanClientFromEnv } from './soroban-client.js';

export async function simulateLatestContractMethod(method: string, args: unknown[]) {
  const deployment = loadLatestDeployment();
  const client = createSorobanClientFromEnv();
  const contractId = process.env.CONTRACT_ID ?? deployment?.contractId;

  if (!contractId) {
    throw new Error('No contractId available in env or deployments/latest-deployment.json');
  }

  return client.simulateInvoke({
    contractId,
    method,
    args,
  });
}
