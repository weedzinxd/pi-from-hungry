#!/usr/bin/env python3
import json
import os

def carregar_abi_completa(arquivo_artifact="artifacts/contracts/HungerReliefAgent.sol/HungerReliefAgent.json"):
    """Carrega o arquivo artifact completo e extrai só a ABI"""
    with open(arquivo_artifact, "r") as f:
        artifact = json.load(f)
    return artifact.get("abi", [])

def carregar_hotspots(arquivo="backend-ia/hotspots_detectados.json"):
    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)

def preparar_registro(hotspot):
    location_hash = "simulado/" + hotspot["regiao"].replace(" ", "_")
    severity = max(1, min(10, int(hotspot["score_fome"] * 10)))
    estimated_cost = int(hotspot["estimativa_custo_pi"] * 1e18)
    
    return {
        "function": "registerHotspot",
        "params": [location_hash, severity, str(estimated_cost)],
        "metadata": hotspot
    }

def main():
    print("🔗 Pi From Hungry - Preparando integração...")
    
    # Carrega ABI do artifact completo
    abi = carregar_abi_completa()
    print("✅ ABI carregada: " + str(len(abi)) + " itens")
    
    # Carrega hotspots detectados
    hotspots = carregar_hotspots()
    print("✅ Hotspots carregados: " + str(len(hotspots)))
    
    # Prepara payloads
    payloads = [preparar_registro(h) for h in hotspots]
    
    # Salva resultados
    output_file = "backend-ia/payloads_prontos.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(payloads, f, indent=2, ensure_ascii=False)
    
    print("\n📋 Payloads prontos para envio on-chain:")
    for p in payloads:
        m = p["metadata"]
        print("📍 " + m["regiao"] + " | Severity: " + str(p["params"][1]) + " | Custo: " + str(int(p["params"][2])/1e18) + " π")
    
    print("\n✅ " + str(len(payloads)) + " payloads salvos em '" + output_file + "'")
    print("🚀 Quando o RPC suportar transações, use estes payloads!")

if __name__ == "__main__":
    main()
