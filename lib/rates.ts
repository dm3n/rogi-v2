// Canadian Mortgage Rules & Rates (current as of 2025/2026)

// Stress test: qualifying rate = max(floor, contract_rate + 2%)
export const STRESS_TEST_FLOOR = 0.0525         // 5.25% Bank of Canada minimum
export const DEFAULT_CONTRACT_RATE = 0.0499     // ~5% competitive 5-year fixed
export const DEFAULT_VARIABLE_RATE = 0.0559     // ~5.6% prime - 0.5%

// Amortization (years)
export const AMORT_INSURED = 25
export const AMORT_CONVENTIONAL = 30

// GDS / TDS limits
export const INSURED_MAX_GDS = 0.39
export const INSURED_MAX_TDS = 0.44
export const CONVENTIONAL_MAX_GDS = 0.35
export const CONVENTIONAL_MAX_TDS = 0.42

// CMHC insurance premiums (on mortgage amount, not purchase price)
export const CMHC_BRACKETS = [
  { minDown: 0.05,  maxDown: 0.0999, premium: 0.0400 },
  { minDown: 0.10,  maxDown: 0.1499, premium: 0.0310 },
  { minDown: 0.15,  maxDown: 0.1999, premium: 0.0280 },
]

// As of December 15, 2024 — insured limit raised to $1.5M
export const MAX_INSURED_PRICE = 1_500_000

// Standard cost estimates used in GDS/TDS
export const MONTHLY_HEATING_ESTIMATE = 150
export const ANNUAL_PROPERTY_TAX_RATE  = 0.01   // 1% of purchase price
