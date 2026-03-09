'use client'

import { ApplicationState } from '@/lib/types'
import {
  getMaxPurchasePrice,
  calculateMortgage,
  fmtCAD,
  fmtPct,
  parseRawDollars,
  getStressTestRate,
} from '@/lib/mortgage-calc'
import { DEFAULT_CONTRACT_RATE } from '@/lib/rates'
import { TrendingUp, Home, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEP_MESSAGES: Record<number, { headline: string; sub: string }> = {
  1: { headline: 'Your best rate.\nA simple process.', sub: 'Canada\'s fastest mortgage pre-approval.' },
  2: { headline: 'Every mortgage journey\nis different.', sub: 'Tell us what you\'re trying to do and we\'ll tailor the experience.' },
  3: { headline: 'Just a few details\nto get started.', sub: 'All fields optional — fill in what you know.' },
  4: { headline: 'What\'s your income?', sub: 'Enter your gross annual income to unlock your instant buying power estimate.' },
}

interface Props {
  step: number
  state: ApplicationState
}

export default function LeftPanel({ step, state }: Props) {
  const primaryIncome = parseRawDollars(state.income.annualIncome)
  const coIncome = parseRawDollars(state.income.coApplicantIncome)
  const totalIncome = primaryIncome + coIncome

  const monthlyDebts =
    parseRawDollars(state.liabilities.carPayment) +
    parseRawDollars(state.liabilities.studentLoan) +
    parseRawDollars(state.liabilities.creditCardMinPayment) +
    parseRawDollars(state.liabilities.otherMonthlyDebt)

  // Resolve purchase price & down payment
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

  const hasIncome = totalIncome > 0
  const maxPrice = hasIncome
    ? getMaxPurchasePrice({ annualIncome: totalIncome, downPayment, monthlyDebts })
    : 0

  // If we have a specific purchase price and income, show calc for that price
  const calc =
    hasIncome && purchasePrice > 0 && downPayment >= 0
      ? calculateMortgage({ purchasePrice, downPayment, annualIncome: totalIncome, monthlyDebts })
      : null

  const stressRate = getStressTestRate(DEFAULT_CONTRACT_RATE)

  // Show live calc panel from step 4 onwards if income is available
  const showCalcPanel = step >= 4 && hasIncome

  if (!showCalcPanel) {
    const msg = STEP_MESSAGES[step] ?? STEP_MESSAGES[1]
    return (
      <div className="hidden md:flex flex-col justify-between h-full bg-violet-100 px-10 py-12 min-h-screen">
        <div className="space-y-12">
          <span className="text-2xl font-bold tracking-tight text-violet-900">ROGI</span>
          <div>
            <p className="text-violet-800 text-xl font-semibold leading-snug whitespace-pre-line mb-2">
              {msg.headline}
            </p>
            <p className="text-violet-600 text-sm">{msg.sub}</p>
            <Link
              href="/buildout"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors"
            >
              Complete ROGI Buildout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <p className="text-violet-400 text-xs">Powered by ROGI · rogi.ca</p>
      </div>
    )
  }

  const targetPct = purchasePrice > 0 && maxPrice > 0 ? purchasePrice / maxPrice : 0
  const targetOk = purchasePrice > 0 && purchasePrice <= maxPrice

  return (
    <div className="hidden md:flex flex-col h-full bg-violet-900 px-8 py-10 min-h-screen text-white">
      <span className="text-xl font-bold tracking-tight text-violet-200 mb-8">ROGI</span>

      {/* Max buying power */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-wide">Buying Power</p>
        </div>
        <p className="text-4xl font-bold text-white leading-none">{fmtCAD(maxPrice, true)}</p>
        <p className="text-violet-400 text-xs mt-1.5">
          Based on {fmtCAD(totalIncome)}/yr{coIncome > 0 ? ' combined' : ''} gross
          {monthlyDebts > 0 ? ` · ${fmtCAD(monthlyDebts)}/mo debts` : ''}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-violet-700 mb-6" />

      {/* Stress test rate */}
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
        <div>
          <p className="text-xs text-violet-300 font-medium">Stress Test Rate</p>
          <p className="text-white font-bold">{fmtPct(stressRate)}</p>
          <p className="text-violet-500 text-xs">{fmtPct(DEFAULT_CONTRACT_RATE)} contract + 2%</p>
        </div>
      </div>

      {/* Target property (if entered) */}
      {purchasePrice > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-xs text-violet-300 font-medium">Your Target</p>
          </div>
          <p className="text-white font-bold text-xl">{fmtCAD(purchasePrice)}</p>
          <div className="mt-2 h-1.5 bg-violet-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${targetOk ? 'bg-green-400' : 'bg-red-400'}`}
              style={{ width: `${Math.min(targetPct * 100, 100)}%` }}
            />
          </div>
          <p className={`text-xs mt-1 ${targetOk ? 'text-green-400' : 'text-red-400'}`}>
            {targetOk
              ? `✓ Within budget — ${fmtCAD(maxPrice - purchasePrice, true)} room`
              : `⚠ ${fmtCAD(purchasePrice - maxPrice, true)} over budget`}
          </p>
        </div>
      )}

      {/* Monthly payment (for calc'd or max price) */}
      {(calc || maxPrice > 0) && (
        <div className="bg-violet-800 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-violet-400" />
            <p className="text-xs text-violet-300 font-medium">
              {purchasePrice > 0 && calc ? 'Monthly at Target Price' : 'Monthly at Max Price'}
            </p>
          </div>
          {calc ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-violet-400">Principal & Interest</span>
                <span className="text-white font-medium">{fmtCAD(calc.monthlyPaymentActual)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-violet-400">Property Tax (est.)</span>
                <span className="text-white font-medium">{fmtCAD(calc.monthlyPropertyTax)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-violet-400">Heating (est.)</span>
                <span className="text-white font-medium">{fmtCAD(calc.monthlyHeating)}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-violet-700 pt-1.5 mt-1.5">
                <span className="text-violet-300 font-semibold">Total / month</span>
                <span className="text-white font-bold">{fmtCAD(calc.monthlyHousingTotal)}</span>
              </div>
            </div>
          ) : (
            <p className="text-white font-bold text-xl">
              {fmtCAD(
                calculateMortgage({
                  purchasePrice: maxPrice,
                  downPayment: Math.max(downPayment, maxPrice * 0.1),
                  annualIncome: totalIncome,
                  monthlyDebts,
                }).monthlyHousingTotal,
              )}<span className="text-violet-400 text-sm font-normal">/mo</span>
            </p>
          )}
        </div>
      )}

      {/* Qualification ratios (if calc) */}
      {calc && (
        <div className="space-y-2.5">
          {[
            { label: 'GDS', value: calc.gdsRatio, max: calc.maxGDS },
            { label: 'TDS', value: calc.tdsRatio, max: calc.maxTDS },
          ].map(({ label, value, max }) => {
            const over = value > max
            return (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-violet-400">{label} Ratio</span>
                  <span className={over ? 'text-red-400' : 'text-green-400'}>
                    {fmtPct(value)} {over ? '↑' : '✓'}
                  </span>
                </div>
                <div className="h-1 bg-violet-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${over ? 'bg-red-400' : 'bg-green-400'}`}
                    style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-auto pt-8 space-y-2">
        <Link
          href="/buildout"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-500 hover:text-violet-300 transition-colors"
        >
          Complete ROGI Buildout <ArrowRight className="w-3 h-3" />
        </Link>
        <p className="text-violet-600 text-xs">Powered by ROGI · rogi.ca</p>
      </div>
    </div>
  )
}
