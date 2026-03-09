import {
  STRESS_TEST_FLOOR,
  DEFAULT_CONTRACT_RATE,
  AMORT_INSURED,
  AMORT_CONVENTIONAL,
  INSURED_MAX_GDS,
  INSURED_MAX_TDS,
  CONVENTIONAL_MAX_GDS,
  CONVENTIONAL_MAX_TDS,
  CMHC_BRACKETS,
  MAX_INSURED_PRICE,
  MONTHLY_HEATING_ESTIMATE,
  ANNUAL_PROPERTY_TAX_RATE,
} from './rates'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Canadian semi-annual compounding → effective monthly rate */
export function effectiveMonthlyRate(nominalAnnual: number): number {
  return Math.pow(1 + nominalAnnual / 2, 1 / 6) - 1
}

/** Standard Canadian mortgage monthly payment */
export function calcMonthlyPayment(
  principal: number,
  nominalAnnualRate: number,
  amortYears: number,
): number {
  if (principal <= 0 || nominalAnnualRate <= 0) return 0
  const r = effectiveMonthlyRate(nominalAnnualRate)
  const n = amortYears * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

/** Stress test qualifying rate */
export function getStressTestRate(contractRate = DEFAULT_CONTRACT_RATE): number {
  return Math.max(STRESS_TEST_FLOOR, contractRate + 0.02)
}

/** Minimum down payment required (Canadian rules, Dec 2024) */
export function getMinDownPayment(purchasePrice: number): number {
  if (purchasePrice <= 0) return 0
  if (purchasePrice > 1_500_000) return purchasePrice * 0.2
  if (purchasePrice > 1_000_000) return purchasePrice * 0.1
  if (purchasePrice > 500_000) return 25_000 + (purchasePrice - 500_000) * 0.1
  return purchasePrice * 0.05
}

export function getMinDownPct(purchasePrice: number): number {
  if (purchasePrice <= 0) return 0.05
  return getMinDownPayment(purchasePrice) / purchasePrice
}

/** CMHC insurance premium amount */
export function getCMHCPremium(mortgageAmount: number, downPaymentPct: number): number {
  if (downPaymentPct >= 0.2) return 0
  const bracket = CMHC_BRACKETS.find(
    (b) => downPaymentPct >= b.minDown && downPaymentPct <= b.maxDown,
  )
  return bracket ? mortgageAmount * bracket.premium : 0
}

// ─── Main Calculation ───────────────────────────────────────────────────────

export interface MortgageCalcParams {
  purchasePrice: number
  downPayment: number
  annualIncome: number
  monthlyDebts?: number
  contractRate?: number
  condoFeeMonthly?: number
}

export interface MortgageCalcResult {
  // Inputs
  purchasePrice: number
  downPayment: number
  annualIncome: number
  totalMonthlyDebts: number

  // Down payment
  downPaymentPct: number
  minDownPayment: number
  downPaymentShortfall: number
  hasEnoughDown: boolean

  // Mortgage structure
  mortgageAmount: number
  cmhcPremium: number
  totalMortgage: number
  isInsured: boolean
  ltv: number
  amortizationYears: number

  // Rates
  contractRate: number
  stressTestRate: number

  // Monthly costs (at stress-test rate)
  monthlyPayment: number
  monthlyPropertyTax: number
  monthlyHeating: number
  monthlyCondoAllowance: number
  monthlyHousingTotal: number

  // Actual payment at contract rate
  monthlyPaymentActual: number

  // Ratios
  monthlyIncome: number
  gdsRatio: number
  tdsRatio: number
  maxGDS: number
  maxTDS: number
  passesGDS: boolean
  passesTDS: boolean
  qualifies: boolean

  // Affordability
  maxAffordablePrice: number
  maxMortgage: number
}

export function calculateMortgage(params: MortgageCalcParams): MortgageCalcResult {
  const {
    purchasePrice,
    downPayment,
    annualIncome,
    monthlyDebts = 0,
    contractRate = DEFAULT_CONTRACT_RATE,
    condoFeeMonthly = 0,
  } = params

  const stressTestRate = getStressTestRate(contractRate)
  const downPaymentPct = purchasePrice > 0 ? downPayment / purchasePrice : 0
  const isInsured =
    purchasePrice > 0 &&
    purchasePrice <= MAX_INSURED_PRICE &&
    downPaymentPct > 0 &&
    downPaymentPct < 0.2
  const amortizationYears = isInsured ? AMORT_INSURED : AMORT_CONVENTIONAL
  const maxGDS = isInsured ? INSURED_MAX_GDS : CONVENTIONAL_MAX_GDS
  const maxTDS = isInsured ? INSURED_MAX_TDS : CONVENTIONAL_MAX_TDS

  const mortgageAmount = Math.max(0, purchasePrice - downPayment)
  const cmhcPremium = isInsured ? getCMHCPremium(mortgageAmount, downPaymentPct) : 0
  const totalMortgage = mortgageAmount + cmhcPremium
  const ltv = purchasePrice > 0 ? totalMortgage / purchasePrice : 0

  // Monthly payment at stress-test rate (used for qualification)
  const monthlyPayment = calcMonthlyPayment(totalMortgage, stressTestRate, amortizationYears)
  // Actual payment at contract rate (shown to borrower)
  const monthlyPaymentActual = calcMonthlyPayment(totalMortgage, contractRate, amortizationYears)

  const monthlyIncome = annualIncome / 12
  const monthlyPropertyTax = purchasePrice > 0 ? (purchasePrice * ANNUAL_PROPERTY_TAX_RATE) / 12 : 0
  const monthlyHeating = MONTHLY_HEATING_ESTIMATE
  const monthlyCondoAllowance = condoFeeMonthly * 0.5
  const monthlyHousingTotal = monthlyPayment + monthlyPropertyTax + monthlyHeating + monthlyCondoAllowance

  const gdsRatio = monthlyIncome > 0 ? monthlyHousingTotal / monthlyIncome : 1
  const tdsRatio = monthlyIncome > 0 ? (monthlyHousingTotal + monthlyDebts) / monthlyIncome : 1
  const passesGDS = gdsRatio <= maxGDS
  const passesTDS = tdsRatio <= maxTDS

  const minDownPayment = getMinDownPayment(purchasePrice)
  const downPaymentShortfall = Math.max(0, minDownPayment - downPayment)
  const hasEnoughDown = downPaymentShortfall === 0

  const qualifies = passesGDS && passesTDS && hasEnoughDown && annualIncome > 0

  const maxAffordablePrice = getMaxPurchasePrice({
    annualIncome,
    downPayment,
    monthlyDebts,
    contractRate,
  })
  const maxMortgage = Math.max(0, maxAffordablePrice - downPayment)

  return {
    purchasePrice,
    downPayment,
    annualIncome,
    totalMonthlyDebts: monthlyDebts,
    downPaymentPct,
    minDownPayment,
    downPaymentShortfall,
    hasEnoughDown,
    mortgageAmount,
    cmhcPremium,
    totalMortgage,
    isInsured,
    ltv,
    amortizationYears,
    contractRate,
    stressTestRate,
    monthlyPayment,
    monthlyPropertyTax,
    monthlyHeating,
    monthlyCondoAllowance,
    monthlyHousingTotal,
    monthlyPaymentActual,
    monthlyIncome,
    gdsRatio,
    tdsRatio,
    maxGDS,
    maxTDS,
    passesGDS,
    passesTDS,
    qualifies,
    maxAffordablePrice,
    maxMortgage,
  }
}

// ─── Max Affordable Price (binary search) ──────────────────────────────────

export interface MaxPriceParams {
  annualIncome: number
  downPayment: number
  monthlyDebts?: number
  contractRate?: number
}

export function getMaxPurchasePrice(params: MaxPriceParams): number {
  const { annualIncome, downPayment, monthlyDebts = 0, contractRate = DEFAULT_CONTRACT_RATE } = params

  if (annualIncome <= 0) return 0

  const monthlyIncome = annualIncome / 12
  const stressRate = getStressTestRate(contractRate)

  let lo = 0
  let hi = 5_000_000

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    const dp = Math.min(downPayment, mid * 0.95) // can't exceed 95% of price as down
    const dpPct = mid > 0 ? dp / mid : 0
    const isIns = mid <= MAX_INSURED_PRICE && dpPct < 0.2 && dpPct >= 0.05
    const amort = isIns ? AMORT_INSURED : AMORT_CONVENTIONAL
    const mxGDS = isIns ? INSURED_MAX_GDS : CONVENTIONAL_MAX_GDS
    const mxTDS = isIns ? INSURED_MAX_TDS : CONVENTIONAL_MAX_TDS

    const mort = Math.max(0, mid - dp)
    const cmhc = isIns ? getCMHCPremium(mort, dpPct) : 0
    const totalMort = mort + cmhc
    const payment = calcMonthlyPayment(totalMort, stressRate, amort)
    const propTax = (mid * ANNUAL_PROPERTY_TAX_RATE) / 12
    const housing = payment + propTax + MONTHLY_HEATING_ESTIMATE

    const gds = housing / monthlyIncome
    const tds = (housing + monthlyDebts) / monthlyIncome
    const minDown = getMinDownPayment(mid)

    if (gds <= mxGDS && tds <= mxTDS && dp >= minDown) {
      lo = mid
    } else {
      hi = mid
    }
  }

  return Math.round(lo / 1000) * 1000 // round to nearest $1k
}

// ─── Refinance Equity ───────────────────────────────────────────────────────

export interface RefinanceResult {
  estimatedValue: number
  currentBalance: number
  currentLTV: number
  availableEquity: number
  maxRefinanceAmount: number     // 80% LTV conventional
  netProceeds: number            // maxRefinanceAmount - currentBalance
  monthlyPaymentNew: number
  contractRate: number
}

export function calculateRefinance(params: {
  estimatedValue: number
  currentBalance: number
  contractRate?: number
}): RefinanceResult {
  const { estimatedValue, currentBalance, contractRate = DEFAULT_CONTRACT_RATE } = params
  const currentLTV = estimatedValue > 0 ? currentBalance / estimatedValue : 0
  const maxRefinanceAmount = estimatedValue * 0.8 // conventional max LTV
  const availableEquity = Math.max(0, estimatedValue - currentBalance)
  const netProceeds = Math.max(0, maxRefinanceAmount - currentBalance)
  const monthlyPaymentNew = calcMonthlyPayment(maxRefinanceAmount, contractRate, AMORT_CONVENTIONAL)

  return {
    estimatedValue,
    currentBalance,
    currentLTV,
    availableEquity,
    maxRefinanceAmount,
    netProceeds,
    monthlyPaymentNew,
    contractRate,
  }
}

// ─── Formatting ─────────────────────────────────────────────────────────────

export function fmtCAD(n: number, compact = false): string {
  if (!isFinite(n) || isNaN(n)) return '$—'
  if (compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  }
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function fmtPct(n: number, decimals = 1): string {
  if (!isFinite(n) || isNaN(n)) return '—%'
  return `${(n * 100).toFixed(decimals)}%`
}

export function parseRawDollars(raw: string): number {
  const n = parseInt(raw.replace(/\D/g, ''), 10)
  return isNaN(n) ? 0 : n
}
