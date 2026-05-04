# Methodology v1/v2

## Objective
Move the project from static demo hotspots to a more explainable, evidence-oriented curation pipeline.

## Current inputs
1. detector output in `backend-ia/hotspots_detectados.json`
2. live-ish weather data from Open-Meteo
3. regional metadata hardening

## Derived scores
- `climateStressScore`
- `foodRiskScore`
- `operationalPriorityScore`
- `confidenceScore`
- `precipitationAnomalyScore`
- `ndviProxy`

## Evidence fields
- `sourceModelVersion`
- `computedAt`
- `evidenceHash`
- `weatherSource`
- `detectorTimestamp`

## Why this matters
This improves:
- explainability
- reproducibility
- public trust
- future blockchain anchoring

## Next evolutions
- NDVI/EVI real inputs
- historical precipitation anomalies
- conflict data
- food price data
- historical trend analysis
- versioned datasets and model registry
