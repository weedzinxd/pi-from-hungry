import process from 'node:process';

interface CheckResult {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  detail?: string;
}

async function runCheck(name: string, url: string, matcher?: string): Promise<CheckResult> {
  try {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const text = await response.text();
    const matched = matcher ? text.includes(matcher) : response.ok;

    return {
      name,
      url,
      ok: response.ok && matched,
      status: response.status,
      detail: matcher ? `matcher=${matcher} matched=${matched}` : undefined,
    };
  } catch (error) {
    return {
      name,
      url,
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const dashboardBase = (process.env.DASHBOARD_URL ?? process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
  const apiBase = (process.env.API_URL ?? process.argv[3] ?? (dashboardBase.includes('vercel.app') ? `${dashboardBase}/api` : 'http://localhost:8080')).replace(/\/$/, '');

  const checks = await Promise.all([
    runCheck('dashboard:home', `${dashboardBase}/`, 'Tecnologia humanitária'),
    runCheck('dashboard:dashboard', `${dashboardBase}/dashboard`, 'Visão operacional'),
    runCheck('dashboard:hotspots', `${dashboardBase}/hotspots`, 'Hotspots ativos'),
    runCheck('dashboard:proofs', `${dashboardBase}/proofs`, 'Proofs'),
    runCheck('dashboard:launch', `${dashboardBase}/launch`, 'Launch readiness'),
    runCheck('dashboard:transparency', `${dashboardBase}/transparency`, 'Transparência'),
    runCheck('api:health', `${apiBase}/health`),
    runCheck('api:public-status', `${apiBase}/public-status`),
    runCheck('api:deployment-status', `${apiBase}/deployment-status`),
    runCheck('api:proofs', `${apiBase}/proofs`),
  ]);

  const failed = checks.filter((check) => !check.ok);
  console.log(JSON.stringify({ dashboardBase, apiBase, passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ public demo check failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
