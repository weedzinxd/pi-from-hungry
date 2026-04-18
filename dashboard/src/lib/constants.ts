import type { Severity } from '@/types/domain';

export const PI_PRICE = 0.2041;
export const GVC_VALUE = 314159;
export const COST_PER_PERSON_YEAR = 150;

export const SEVERITY_COLORS: Record<Severity, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  ELEVATED: '#eab308',
  MODERATE: '#22c55e',
};
