# ML Pipeline v1

Primeira versão do pipeline de hotspots com dados mais próximos do mundo real.

## O que faz
- lê hotspots detectados em `backend-ia/hotspots_detectados.json`
- enriquece cada hotspot com clima atual via Open-Meteo
- calcula scores transparentes:
  - `foodRiskScore`
  - `climateStressScore`
  - `operationalPriorityScore`
  - `confidenceScore`
- exporta um dataset curado para `data/curated-hotspots.json`
- atualiza histórico temporal em `data/hotspot-history.json`

## Executar
```bash
python3 services/ml-pipeline/build_hotspots.py
```

## Fonte preferencial na API
Defina:
```env
API_HOTSPOTS_SOURCE=auto
```
Quando `data/curated-hotspots.json` existir, a API prioriza esse arquivo.

## Observações
- a camada de clima usa Open-Meteo sem chave
- se a consulta externa falhar, o pipeline usa fallback controlado
- a metodologia é transparente e extensível para NDVI, conflito e preços de alimentos
