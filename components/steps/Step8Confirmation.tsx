'use client'

import { ApplicationState } from '@/lib/types'
import { generateDocumentList } from '@/lib/document-requests'
import {
  calculateMortgage,
  calculateRefinance,
  getMaxPurchasePrice,
  fmtCAD,
  fmtPct,
  parseRawDollars,
  MortgageCalcResult,
} from '@/lib/mortgage-calc'
import { DEFAULT_CONTRACT_RATE } from '@/lib/rates'
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Home,
  DollarSign,
  BarChart2,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const MORTGAGE_TYPE_LABELS: Record<string, string> = {
  purchase: 'Purchase',
  preapproval: 'Pre-Approval',
  refinance: 'Refinance',
  renewal: 'Renewal',
}

interface Props {
  state: ApplicationState
}

function RatioBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(value / max, 1)
  const over = value > max
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className={over ? 'text-red-600 font-semibold' : 'text-green-700 font-semibold'}>
          {fmtPct(value)} / {fmtPct(max)} max
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 0.85 ? 'bg-amber-400' : 'bg-green-500'}`}
          style={{ width: `${Math.min(pct * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}

export default function Step8Confirmation({ state }: Props) {
  const primaryIncome = parseRawDollars(state.income.annualIncome)
  const coIncome = parseRawDollars(state.income.coApplicantIncome)
  const totalIncome = primaryIncome + coIncome

  const monthlyDebts =
    parseRawDollars(state.liabilities.carPayment) +
    parseRawDollars(state.liabilities.studentLoan) +
    parseRawDollars(state.liabilities.creditCardMinPayment) +
    parseRawDollars(state.liabilities.otherMonthlyDebt)

  const totalAssets =
    parseRawDollars(state.extended.assets.savingsChequing) +
    parseRawDollars(state.extended.assets.stocksBonds) +
    parseRawDollars(state.extended.assets.rrsps)

  // ── Purchase / Pre-Approval ─────────────────────────────────────────────
  let purchasePrice = 0
  let downPayment = 0
  if (state.mortgageType === 'purchase') {
    purchasePrice = parseRawDollars(state.purchase.purchasePrice)
    if (state.purchase.downPaymentType === 'dollar') {
      downPayment = parseRawDollars(state.purchase.downPayment)
    } else {
      downPayment = Math.round(purchasePrice * (parseFloat(state.purchase.downPayment || '0') / 100))
    }
  } else if (state.mortgageType === 'preapproval') {
    purchasePrice = parseRawDollars(state.preapproval.idealPurchasePrice)
    if (state.preapproval.downPaymentType === 'dollar') {
      downPayment = parseRawDollars(state.preapproval.downPayment)
    } else {
      downPayment = Math.round(purchasePrice * (parseFloat(state.preapproval.downPayment || '0') / 100))
    }
  }

  const maxPrice = totalIncome > 0
    ? getMaxPurchasePrice({ annualIncome: totalIncome, downPayment, monthlyDebts })
    : 0

  let calc: MortgageCalcResult | null = null
  if ((state.mortgageType === 'purchase' || state.mortgageType === 'preapproval') && totalIncome > 0) {
    const priceToUse = purchasePrice > 0 ? purchasePrice : maxPrice
    if (priceToUse > 0 && downPayment >= 0) {
      calc = calculateMortgage({
        purchasePrice: priceToUse,
        downPayment,
        annualIncome: totalIncome,
        monthlyDebts,
      })
    }
  }

  // ── Refinance ───────────────────────────────────────────────────────────
  const refiCalc =
    state.mortgageType === 'refinance'
      ? calculateRefinance({
          estimatedValue: parseRawDollars(state.refinance.estimatedValue),
          currentBalance: parseRawDollars(state.refinance.currentLoan),
        })
      : null

  const docs = generateDocumentList(state)
  const hasIncome = totalIncome > 0

  // Status
  const getStatus = () => {
    if (!hasIncome) return { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 }
    if (calc?.qualifies) return { label: 'Stress Test Passed', color: 'bg-green-100 text-green-800', icon: ShieldCheck }
    if (calc && (!calc.passesGDS || !calc.passesTDS)) return { label: 'Ratio Exceeded', color: 'bg-amber-100 text-amber-800', icon: AlertCircle }
    return { label: 'Income Verified', color: 'bg-green-100 text-green-800', icon: CheckCircle2 }
  }
  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <div className="max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {hasIncome ? 'Your Buyer Power Report' : 'Application Received!'}
        </h1>
        <p className="text-gray-500 text-sm">
          {hasIncome
            ? 'Instant analysis based on your submitted details.'
            : 'A broker will review your application and be in touch within 2 business hours.'}
        </p>
        {/* Qualification badge */}
        {hasIncome && (
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </div>
        )}
      </div>

      {/* ── Max Buying Power ─────────────────────────────────────── */}
      {hasIncome && maxPrice > 0 && (
        <div className="bg-violet-700 text-white rounded-2xl p-6 mb-5 relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10">
            <TrendingUp className="w-20 h-20" />
          </div>
          <p className="text-violet-200 text-xs font-semibold uppercase tracking-wide mb-1">
            Maximum Purchase Price
          </p>
          <p className="text-4xl font-bold mb-1">{fmtCAD(maxPrice)}</p>
          <p className="text-violet-300 text-sm">
            Based on {fmtCAD(totalIncome)}/yr
            {coIncome > 0 ? ' combined' : ''} gross income
            {monthlyDebts > 0 ? ` · ${fmtCAD(monthlyDebts)}/mo debts` : ''}
          </p>
          <p className="text-violet-300 text-xs mt-1">
            Stress-tested at {fmtPct(calc?.stressTestRate ?? (DEFAULT_CONTRACT_RATE + 0.02))}
          </p>
        </div>
      )}

      {/* ── Purchase Analysis ─────────────────────────────────────── */}
      {calc && (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <Home className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-800">
              {state.mortgageType === 'purchase' ? 'Purchase Analysis' : 'Pre-Approval Analysis'}
            </h2>
            {purchasePrice > 0 && (
              <Badge className={`ml-auto text-xs ${calc.qualifies ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
                {calc.qualifies ? '✓ Qualifies' : '⚠ Review Needed'}
              </Badge>
            )}
          </div>
          <div className="px-5 divide-y divide-gray-100">
            {purchasePrice > 0 && (
              <Row
                label={state.mortgageType === 'purchase' ? 'Purchase Price' : 'Target Price'}
                value={fmtCAD(purchasePrice)}
                sub={purchasePrice <= maxPrice ? '✓ Within budget' : `⚠ ${fmtCAD(purchasePrice - maxPrice)} over budget`}
              />
            )}
            {downPayment > 0 && (
              <Row
                label="Down Payment"
                value={`${fmtCAD(downPayment)} (${fmtPct(calc.downPaymentPct)})`}
                sub={calc.hasEnoughDown ? `Minimum required: ${fmtCAD(calc.minDownPayment)} ✓` : `Need ${fmtCAD(calc.downPaymentShortfall)} more`}
              />
            )}
            {calc.mortgageAmount > 0 && (
              <Row label="Mortgage Amount" value={fmtCAD(calc.mortgageAmount)} />
            )}
            {calc.cmhcPremium > 0 && (
              <Row
                label="CMHC Insurance Premium"
                value={`+${fmtCAD(calc.cmhcPremium)}`}
                sub={`${fmtPct(calc.cmhcPremium / calc.mortgageAmount)} of mortgage — added to total`}
              />
            )}
            {calc.totalMortgage > 0 && calc.cmhcPremium > 0 && (
              <Row label="Total Mortgage" value={fmtCAD(calc.totalMortgage)} />
            )}
            <Row
              label="Amortization"
              value={`${calc.amortizationYears} years`}
              sub={calc.isInsured ? 'Insured — 25 yr max' : 'Conventional — 30 yr max'}
            />
          </div>
        </div>
      )}

      {/* ── Monthly Costs ──────────────────────────────────────────── */}
      {calc && calc.totalMortgage > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <DollarSign className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-800">Monthly Cost Estimate</h2>
          </div>
          <div className="px-5 divide-y divide-gray-100">
            <Row
              label="Principal & Interest"
              value={`${fmtCAD(calc.monthlyPaymentActual)}/mo`}
              sub={`At ${fmtPct(calc.contractRate)} (5-yr fixed estimate)`}
            />
            <Row label="Property Tax (est.)" value={`${fmtCAD(calc.monthlyPropertyTax)}/mo`} sub="Based on ~1% of purchase price" />
            <Row label="Heating (est.)" value={`${fmtCAD(calc.monthlyHeating)}/mo`} sub="Standard estimate" />
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-bold text-gray-900">Total Monthly Housing</span>
              <span className="text-lg font-bold text-violet-700">{fmtCAD(calc.monthlyHousingTotal)}/mo</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Qualification Ratios ──────────────────────────────────── */}
      {calc && hasIncome && (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <BarChart2 className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-800">Qualification Ratios</h2>
            <span className="ml-auto text-xs text-gray-400">Stress-tested at {fmtPct(calc.stressTestRate)}</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            <RatioBar
              value={calc.gdsRatio}
              max={calc.maxGDS}
              label={`GDS (Gross Debt Service) — max ${fmtPct(calc.maxGDS)}`}
            />
            <RatioBar
              value={calc.tdsRatio}
              max={calc.maxTDS}
              label={`TDS (Total Debt Service) — max ${fmtPct(calc.maxTDS)}`}
            />
            <p className="text-xs text-gray-400 pt-1">
              {calc.isInsured ? 'Insured mortgage limits apply (GDS 39% / TDS 44%).' : 'Conventional mortgage limits apply (GDS 35% / TDS 42%).'}
            </p>
          </div>
        </div>
      )}

      {/* ── Refinance Summary ─────────────────────────────────────── */}
      {refiCalc && (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <Home className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-800">Refinance Summary</h2>
          </div>
          <div className="px-5 divide-y divide-gray-100">
            <Row label="Estimated Value" value={fmtCAD(refiCalc.estimatedValue)} />
            <Row label="Current Balance" value={fmtCAD(refiCalc.currentBalance)} />
            <Row label="Current LTV" value={fmtPct(refiCalc.currentLTV)} />
            <Row label="Available Equity" value={fmtCAD(refiCalc.availableEquity)} />
            <Row
              label="Max Refinance Amount (80% LTV)"
              value={fmtCAD(refiCalc.maxRefinanceAmount)}
            />
            <Row
              label="Est. Net Proceeds"
              value={fmtCAD(refiCalc.netProceeds)}
              sub={refiCalc.netProceeds > 0 ? 'After paying off existing mortgage' : 'No equity available to pull'}
            />
            <Row
              label="New Monthly Payment (est.)"
              value={`${fmtCAD(refiCalc.monthlyPaymentNew)}/mo`}
              sub={`At ${fmtPct(DEFAULT_CONTRACT_RATE)}, 30-yr amort`}
            />
          </div>
        </div>
      )}

      {/* ── Assets Summary ────────────────────────────────────────── */}
      {totalAssets > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-800">Assets</h2>
          </div>
          <div className="px-5 divide-y divide-gray-100">
            {parseRawDollars(state.extended.assets.savingsChequing) > 0 && (
              <Row label="Savings / Chequing" value={fmtCAD(parseRawDollars(state.extended.assets.savingsChequing))} />
            )}
            {parseRawDollars(state.extended.assets.stocksBonds) > 0 && (
              <Row label="Stocks / Bonds" value={fmtCAD(parseRawDollars(state.extended.assets.stocksBonds))} />
            )}
            {parseRawDollars(state.extended.assets.rrsps) > 0 && (
              <Row label="RRSPs" value={fmtCAD(parseRawDollars(state.extended.assets.rrsps))} />
            )}
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-bold text-gray-900">Total Assets</span>
              <span className="text-sm font-bold text-gray-900">{fmtCAD(totalAssets)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Application Summary ───────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 mb-5 space-y-2">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Submitted</h2>
        {state.personal.fullName && <Row label="Name" value={state.personal.fullName} />}
        {state.personal.email && <Row label="Email" value={state.personal.email} />}
        {state.personal.cell && <Row label="Phone" value={state.personal.cell} />}
        {state.mortgageType && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">Mortgage Type</span>
            <Badge className="bg-violet-700 text-white text-xs">
              {MORTGAGE_TYPE_LABELS[state.mortgageType]}
            </Badge>
          </div>
        )}
      </div>

      {/* ── Document Checklist ────────────────────────────────────── */}
      {docs.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <FileText className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-800">Documents to Prepare</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {docs.map((doc) => (
              <div key={doc.category} className="px-5 py-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {doc.category}
                </p>
                <ul className="space-y-1.5">
                  {doc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-violet-800 mb-2">What happens next</h3>
        <ul className="space-y-2 text-sm text-violet-700">
          <li className="flex items-start gap-2">
            <span className="shrink-0 font-bold">1.</span>
            A ROGI-certified broker will review your file and contact you within 2 business hours.
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 font-bold">2.</span>
            You&apos;ll receive a secure upload link to submit your supporting documents.
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 font-bold">3.</span>
            Once verified, your full Buyer Audit Package will be ready for lender submission.
          </li>
        </ul>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Questions? Call{' '}
        <a href="tel:1-800-000-0000" className="text-violet-600 font-medium">
          1-800-000-0000
        </a>
      </p>
    </div>
  )
}
