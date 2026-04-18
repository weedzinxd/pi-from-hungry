#!/usr/bin/env python3
"""
Pi From Hungry - Detector de Focos de Fome
Versão MVP: Simula detecção com dados de exemplo
"""

import json
import random
from datetime import datetime

# Dados simulados de regiões vulneráveis (substituir por API real depois)
REGIOES_EXEMPLO = [
    {"nome": "Sahel, África", "lat": 14.5, "lon": -2.5, "risco": 0.85},
    {"nome": "Iêmen", "lat": 15.5, "lon": 48.5, "risco": 0.92},
    {"nome": "Sudão do Sul", "lat": 7.0, "lon": 30.0, "risco": 0.88},
    {"nome": "Afeganistão", "lat": 33.9, "lon": 67.7, "risco": 0.79},
    {"nome": "Haiti", "lat": 18.9, "lon": -72.3, "risco": 0.81},
]

def analisar_regiao(regiao):
    """Simula análise de satélite + IA para detectar insegurança alimentar"""
    # Aqui entrariam: NDVI, luz noturna, clima, conflito, preços de alimentos
    score = regiao["risco"] + random.uniform(-0.1, 0.1)
    score = max(0, min(1, score))  # Normaliza entre 0 e 1
    
    return {
        "regiao": regiao["nome"],
        "coordenadas": [regiao["lat"], regiao["lon"]],
        "score_fome": round(score, 3),
        "nivel_urgencia": "CRÍTICO" if score > 0.85 else "ALTO" if score > 0.7 else "MODERADO",
        "estimativa_custo_pi": round(score * 1000, 2),  # Pi estimado para intervenção
        "timestamp": datetime.utcnow().isoformat()
    }

def main():
    print("🛰️  Pi From Hungry - Detector de Fome v0.1")
    print("🔍 Analisando regiões prioritárias...\n")
    
    hotspots = []
    for regiao in REGIOES_EXEMPLO:
        resultado = analisar_regiao(regiao)
        hotspots.append(resultado)
        print(f"📍 {resultado['regiao']}")
        print(f"   🎯 Score: {resultado['score_fome']} | {resultado['nivel_urgencia']}")
        print(f"   💰 Custo estimado: {resultado['estimativa_custo_pi']} π")
        print()
    
    # Salva resultados para possível envio à blockchain depois
    with open("hotspots_detectados.json", "w", encoding="utf-8") as f:
        json.dump(hotspots, f, indent=2, ensure_ascii=False)
    
    print(f"✅ {len(hotspots)} hotspots analisados e salvos em 'hotspots_detectados.json'")
    print("\n🚀 Próximo passo: integrar com RPC da Pi para registrar on-chain!")

if __name__ == "__main__":
    main()
