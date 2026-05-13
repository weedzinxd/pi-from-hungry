# ML Pipeline v3

Pipeline de hotspots com aquisição numérica mais forte e explicabilidade pública ampliada.

## O que faz
- lê hotspots detectados em `backend-ia/hotspots_detectados.json`
- enriquece cada hotspot com clima atual via Open-Meteo Forecast
- busca janela histórica via Open-Meteo Archive para sinais matemáticos reais
- calcula scores transparentes:
  - `foodRiskScore`
  - `climateStressScore`
  - `operationalPriorityScore`
  - `confidenceScore`
  - `precipitationAnomalyScore`
  - `thermalAnomalyScore`
  - `dryDaysRatio`
  - `ndviProxy`
- exporta um dataset curado para `data/curated-hotspots.json`
- atualiza histórico temporal em `data/hotspot-history.json`
- gera auditoria de aquisição em `data/pipeline-source-audit.json`

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
- o pipeline combina forecast + archive para obter sinais numéricos mais confiáveis
- se a consulta externa falhar, o pipeline usa fallbacks controlados e registra isso na auditoria
- a metodologia é transparente e extensível para NDVI real, conflito e preços de alimentos
