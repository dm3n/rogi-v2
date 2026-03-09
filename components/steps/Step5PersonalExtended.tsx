'use client'

import { ExtendedPersonal, Liabilities } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CurrencyInput from '@/components/CurrencyInput'

interface Props {
  data: ExtendedPersonal
  liabilities: Liabilities
  onChange: (data: ExtendedPersonal) => void
  onLiabilitiesChange: (data: Liabilities) => void
  onNext: () => void
  onBack: () => void
}

export default function Step5PersonalExtended({
  data,
  liabilities,
  onChange,
  onLiabilitiesChange,
  onNext,
  onBack,
}: Props) {
  const set = <K extends keyof ExtendedPersonal>(k: K, v: ExtendedPersonal[K]) =>
    onChange({ ...data, [k]: v })
  const setL = <K extends keyof Liabilities>(k: K, v: Liabilities[K]) =>
    onLiabilitiesChange({ ...liabilities, [k]: v })

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Assets & Liabilities</h1>
      <p className="text-gray-500 mb-8">
        The more complete your profile, the stronger your report. All optional.
      </p>

      <div className="space-y-8">
        {/* Monthly Liabilities */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Monthly Debt Payments
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Used to calculate your Total Debt Service (TDS) ratio.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CurrencyInput
              label="Car / Vehicle Payment"
              value={liabilities.carPayment}
              onChange={(v) => setL('carPayment', v)}
              optional
            />
            <CurrencyInput
              label="Student Loan Payment"
              value={liabilities.studentLoan}
              onChange={(v) => setL('studentLoan', v)}
              optional
            />
            <CurrencyInput
              label="Credit Card (min. payment)"
              value={liabilities.creditCardMinPayment}
              onChange={(v) => setL('creditCardMinPayment', v)}
              optional
            />
            <CurrencyInput
              label="Other Monthly Debt"
              value={liabilities.otherMonthlyDebt}
              onChange={(v) => setL('otherMonthlyDebt', v)}
              optional
            />
          </div>
        </div>

        {/* Assets */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Assets</h3>
          <CurrencyInput
            label="Savings / Chequing"
            value={data.assets.savingsChequing}
            onChange={(v) => set('assets', { ...data.assets, savingsChequing: v })}
            optional
          />
          <CurrencyInput
            label="Stocks / Bonds"
            value={data.assets.stocksBonds}
            onChange={(v) => set('assets', { ...data.assets, stocksBonds: v })}
            optional
          />
          <CurrencyInput
            label="RRSPs"
            value={data.assets.rrsps}
            onChange={(v) => set('assets', { ...data.assets, rrsps: v })}
            optional
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Current Address
          </h3>
          <div className="space-y-1.5">
            <Label>
              Street Address <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              placeholder="123 Main St, Toronto, ON"
              value={data.currentAddress}
              onChange={(e) => set('currentAddress', e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Years at Address <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              placeholder="3"
              value={data.yearsAtAddress}
              onChange={(e) => set('yearsAtAddress', e.target.value)}
              inputMode="numeric"
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" className="flex-1 h-12" onClick={onBack}>
          ← Back
        </Button>
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
