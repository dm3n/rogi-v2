'use client'

import { PersonalInfo } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, TrendingUp, ClipboardList } from 'lucide-react'
import { fmtCAD } from '@/lib/mortgage-calc'

interface Props {
  personal: PersonalInfo
  onPersonalChange: (data: PersonalInfo) => void
  maxAffordablePrice: number
  onSubmitNow: () => void
  onFillMore: () => void
  onBack: () => void
}

export default function Step4Decision({
  personal,
  onPersonalChange,
  maxAffordablePrice,
  onSubmitNow,
  onFillMore,
  onBack,
}: Props) {
  const set = (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onPersonalChange({ ...personal, [field]: e.target.value })

  const hasIncome = maxAffordablePrice > 0

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Almost done</h1>
      <p className="text-gray-400 text-sm mb-8">Two optional fields, then choose your path.</p>

      {/* Buying power teaser (if income entered) */}
      {hasIncome && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-violet-600 font-medium uppercase tracking-wide">Est. Buying Power</p>
            <p className="text-2xl font-bold text-violet-900">{fmtCAD(maxAffordablePrice)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-violet-400" />
        </div>
      )}

      {/* DOB + SIN */}
      <div className="space-y-4 mb-8 pb-8 border-b border-gray-100">
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">
            Date of Birth <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input type="date" value={personal.dob} onChange={set('dob')} className="h-11" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-gray-400" />
            Social Insurance Number <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            placeholder="XXX XXX XXX"
            value={personal.sin}
            onChange={set('sin')}
            inputMode="numeric"
            maxLength={11}
            className="h-11"
          />
          <p className="text-xs text-gray-400">Encrypted and never shared without your consent.</p>
        </div>
      </div>

      {/* Path selection */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onSubmitNow}
          className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all duration-150 group"
        >
          <div className="flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {hasIncome ? 'Get My Buyer Power Report' : 'Submit now'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {hasIncome
                  ? 'Instant report — a broker will reach out to verify and move forward.'
                  : 'A broker will follow up to gather anything else needed.'}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onFillMore}
          className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all duration-150 group"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {hasIncome ? 'Unlock My Full Report' : 'Add more details'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Add debts, assets, and properties for a complete analysis — takes 3–5 min.
              </p>
            </div>
          </div>
        </button>
      </div>

      <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back
      </button>
    </div>
  )
}
