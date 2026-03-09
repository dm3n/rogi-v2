'use client'

import { Income, EmploymentType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CurrencyInput from '@/components/CurrencyInput'
import {
  getMaxPurchasePrice,
  fmtCAD,
  fmtPct,
  getStressTestRate,
  parseRawDollars,
} from '@/lib/mortgage-calc'
import { DEFAULT_CONTRACT_RATE } from '@/lib/rates'
import { TrendingUp, Info } from 'lucide-react'

const EMP_OPTIONS: { type: EmploymentType; label: string }[] = [
  { type: 'fulltime-salaried', label: 'Full-Time Salaried' },
  { type: 'fulltime-hourly', label: 'Full-Time Hourly' },
  { type: 'self-employed', label: 'Self-Employed' },
  { type: 'retired', label: 'Retired' },
  { type: 'part-time', label: 'Part-Time' },
  { type: 'seasonal', label: 'Seasonal' },
]

interface Props {
  data: Income
  numApplicants: string
  downPayment: number  // resolved dollar amount for max-price calc
  onChange: (data: Income) => void
  onNext: () => void
  onBack: () => void
}

export default function Step4Income({ data, numApplicants, downPayment, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof Income>(k: K, v: Income[K]) => onChange({ ...data, [k]: v })
  const showCoApplicant = numApplicants === '2' || numApplicants === '3' || numApplicants === '4+'
  const showEmploymentDetails = data.employmentType && data.employmentType !== 'retired'

  const primaryIncome = parseRawDollars(data.annualIncome)
  const coIncome = parseRawDollars(data.coApplicantIncome)
  const totalIncome = primaryIncome + coIncome
  const stressRate = getStressTestRate(DEFAULT_CONTRACT_RATE)

  const maxPrice = totalIncome > 0
    ? getMaxPurchasePrice({ annualIncome: totalIncome, downPayment, monthlyDebts: 0 })
    : 0

  const showPreview = totalIncome > 0

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Income & Employment</h1>
      <p className="text-gray-400 text-sm mb-8">This unlocks your instant buying power estimate.</p>

      <div className="space-y-6">
        {/* Employment type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Employment Type <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EMP_OPTIONS.map((opt) => {
              const selected = data.employmentType === opt.type
              return (
                <button
                  key={opt.type}
                  onClick={() => set('employmentType', selected ? '' : opt.type)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                    selected
                      ? 'border-violet-700 bg-violet-50 text-violet-800'
                      : 'border-gray-200 text-gray-600 hover:border-violet-300'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Company + title */}
        {showEmploymentDetails && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">Company <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input
                placeholder="Acme Corp"
                value={data.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">Job Title <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input
                placeholder="Manager"
                value={data.jobTitle}
                onChange={(e) => set('jobTitle', e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        )}

        {/* Annual income */}
        <CurrencyInput
          label="Annual Gross Income"
          value={data.annualIncome}
          onChange={(v) => set('annualIncome', v)}
        />

        {/* Co-applicant */}
        {showCoApplicant && (
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide pt-2">
              Co-Applicant
            </h3>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Employment Type <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EMP_OPTIONS.map((opt) => {
                  const selected = data.coApplicantEmploymentType === opt.type
                  return (
                    <button
                      key={opt.type}
                      onClick={() => set('coApplicantEmploymentType', selected ? '' : opt.type)}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                        selected
                          ? 'border-violet-700 bg-violet-50 text-violet-800'
                          : 'border-gray-200 text-gray-600 hover:border-violet-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <CurrencyInput
              label="Co-Applicant Annual Gross Income"
              value={data.coApplicantIncome}
              onChange={(v) => set('coApplicantIncome', v)}
              optional
            />
          </div>
        )}

        {/* Live buying power preview */}
        {showPreview && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <p className="text-sm font-semibold text-violet-800">Your Buying Power</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-violet-900">{fmtCAD(maxPrice)}</p>
              <p className="text-xs text-violet-600 mt-0.5">
                Est. max purchase price
                {showCoApplicant && coIncome > 0 ? ` — combined income ${fmtCAD(totalIncome)}/yr` : ` — ${fmtCAD(totalIncome)}/yr gross`}
              </p>
            </div>

            <div className="flex items-start gap-1.5 pt-1 border-t border-violet-200">
              <Info className="w-3 h-3 text-violet-400 mt-0.5 shrink-0" />
              <p className="text-xs text-violet-500">
                Stress-tested at {fmtPct(stressRate)} (contract rate + 2%). Final approval depends on full underwriting.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" className="flex-1 h-12" onClick={onBack}>← Back</Button>
        <Button
          className="flex-1 h-12 bg-violet-700 hover:bg-violet-800 text-white font-medium"
          onClick={onNext}
        >
          Continue →
        </Button>
      </div>
    </div>
  )
}
