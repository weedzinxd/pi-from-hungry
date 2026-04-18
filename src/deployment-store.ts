import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface DeploymentRecord {
  contractId: string;
  wasmHash?: string;
  network: string;
  rpcUrl?: string;
  networkPassphrase?: string;
  timestamp: string;
  ledger?: number;
}

function deploymentsDir() {
  return join(process.cwd(), 'deployments');
}

export function latestDeploymentPath() {
  return join(deploymentsDir(), 'latest-deployment.json');
}

export function saveLatestDeployment(record: DeploymentRecord) {
  const dir = deploymentsDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(latestDeploymentPath(), JSON.stringify(record, null, 2));
}

export function loadLatestDeployment(): DeploymentRecord | null {
  const file = latestDeploymentPath();
  if (!existsSync(file)) {
    return null;
  }

  return JSON.parse(readFileSync(file, 'utf-8')) as DeploymentRecord;
}
