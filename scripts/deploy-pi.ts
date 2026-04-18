import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const network = process.argv[2] ?? 'pi-testnet';
const outputDir = join(process.cwd(), 'deployments');
const outputFile = join(outputDir, 'soroban-deployment-plan.json');

const plan = {
  generatedAt: new Date().toISOString(),
  targetNetwork: network,
  architecture: 'soroban-stellar-compatible',
  status: 'planning-only',
  notes: [
    'Pi From Hungry is being aligned to Soroban/Stellar style contracts.',
    'This repository does not yet bundle the Soroban CLI or stellar-sdk deployment flow.',
    'Use this file as the canonical handoff artifact for Open Mainnet/Testnet deployment automation.'
  ],
  steps: [
    'Build the Rust Soroban contract artifact (.wasm).',
    'Optimize the WASM with soroban contract optimize.',
    'Deploy to the selected network using soroban contract deploy or equivalent signed Stellar transaction flow.',
    'Invoke init(operator, treasury).',
    'Persist the deployed contract id and network passphrase in deployments/latest-deployment.json.'
  ]
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, JSON.stringify(plan, null, 2));

console.log('🛰️ Soroban deployment plan generated');
console.log(`📄 ${outputFile}`);
console.log('ℹ️  Next step: build and deploy contracts/HungerReliefAgent.rs with Soroban toolchain.');
