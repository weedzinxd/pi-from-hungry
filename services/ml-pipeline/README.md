# ML Pipeline v6

Pipeline de hotspots com aquisição numérica mais forte, clima histórico, sinal satelital NOAA e vulnerabilidade macroeconômica pública.

## O que faz
- lê hotspots detectados em `backend-ia/hotspots_detectados.json`
- enriquece cada hotspot com clima atual via Open-Meteo Forecast
- busca janela histórica via Open-Meteo Archive para sinais matemáticos reais
- adiciona camada socioeconômica via World Bank Open Data
- adiciona camada satelital NOAA STAR Vegetation Health Products (VHI/VCI/TCI)
- calcula scores transparentes:
  - `foodRiskScore`
  - `climateStressScore`
  - `economicStressScore`
  - `noaaVegetationStressScore`
  - `operationalPriorityScore`
  - `confidenceScore`
  - `precipitationAnomalyScore`
  - `thermalAnomalyScore`
  - `dryDaysRatio`
  - `ndviProxy`
- exporta um dataset curado para `data/curated-hotspots.json`
- atualiza histórico temporal em `data/hotspot-history.json`
- gera auditoria de aquisição em `data/pipeline-source-audit.json`
- mantém cache local de requisições em `data/pipeline-http-cache.json`

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
- o pipeline combina forecast + archive para obter sinais climáticos numéricos mais confiáveis
- a camada macroeconômica usa PIB per capita e inflação pública do World Bank Open Data
- a camada NOAA usa médias semanais por país do NOAA STAR Vegetation Health Products
- o pipeline usa cache local com TTL por provider para acelerar rebuilds e reduzir atrito operacional
- se a consulta externa falhar, o pipeline usa fallbacks controlados e registra isso na auditoria
- a metodologia é transparente e extensível para NDVI real, conflito e preços de alimentos
