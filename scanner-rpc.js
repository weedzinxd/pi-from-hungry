const { execSync } = require('child_process');

const RPC_URL = "https://rpc.testnet.minepi.com";

// Lista de métodos para testar
const metodos = [
  { name: "getHealth", params: false },
  { name: "getLedger", params: true },
  { name: "getTransaction", params: true },
  { name: "getAccount", params: true },
  { name: "eth_blockNumber", params: false },
  { name: "eth_getBalance", params: true },
  { name: "net_version", params: false },
  { name: "web3_clientVersion", params: false }
];

function rpcCall(method, needsParams) {
  let payload;
  if (needsParams === false) {
    payload = JSON.stringify({ jsonrpc: "2.0", id: 1, method: method });
  } else {
    payload = JSON.stringify({ jsonrpc: "2.0", id: 1, method: method, params: [] });
  }
  
  try {
    const result = execSync(
      `curl -s -X POST ${RPC_URL} -H "Content-Type: application/json" -d '${payload}'`,
      { encoding: 'utf8', timeout: 8000 }
    );
    return JSON.parse(result);
  } catch (error) {
    return { error: "timeout" };
  }
}

console.log("🔍 Scanner RPC da Pi Testnet - Descobrindo capacidades...\n");
console.log("Método".padEnd(25) + "Status".padEnd(15) + "Resposta");
console.log("─".repeat(60));

for (const m of metodos) {
  const result = rpcCall(m.name, m.params);
  
  if (result?.result) {
    console.log(m.name.padEnd(25) + "✅ FUNCIONA".padEnd(15) + JSON.stringify(result.result).slice(0, 30) + "...");
  } else if (result?.error?.code === -32601) {
    console.log(m.name.padEnd(25) + "❌ Não suportado");
  } else if (result?.error?.code === -32602) {
    console.log(m.name.padEnd(25) + "⚠️ Params incorretos");
  } else if (result?.error) {
    console.log(m.name.padEnd(25) + "⚠️ Erro: " + result.error.message);
  } else {
    console.log(m.name.padEnd(25) + "❓ Desconhecido");
  }
}

console.log("\n🎯 Scanner concluído!");
