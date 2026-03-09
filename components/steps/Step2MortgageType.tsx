'use client'

import { MortgageType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Home, CheckCircle, RefreshCw, Calendar } from 'lucide-react'

interface Props {
  value: MortgageType | null
  onChange: (type: MortgageType) => void
  onNext: () => void
}

const OPTIONS: { type: MortgageType; icon: React.ReactNode; title: string; desc: string }[] = [
  { type: 'purchase',    icon: <Home className="w-5 h-5" />,         title: 'Purchase',    desc: 'I have an accepted offer or property in mind' },
  { type: 'preapproval', icon: <CheckCircle className="w-5 h-5" />,  title: 'Pre-Approval', desc: 'Know my budget before I start shopping' },
  { type: 'refinance',   icon: <RefreshCw className="w-5 h-5" />,    title: 'Refinance',   desc: 'Access equity or lower my rate' },
  { type: 'renewal',     icon: <Calendar className="w-5 h-5" />,     title: 'Renewal',     desc: 'My mortgage is coming up for renewal' },
]

export default function Step2MortgageType({ value, onChange, onNext }: Props) {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">What are you looking to do?</h1>
      <p className="text-gray-400 text-sm mb-8">Choose the option that fits your situation.</p>

      <div className="space-y-2 mb-8">
        {OPTIONS.map((opt) => {
          const selected = value === opt.type
          return (
            <button
              key={opt.type}
              onClick={() => onChange(opt.type)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                selected
                  ? 'border-violet-600 bg-violet-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={selected ? 'text-violet-600' : 'text-gray-400'}>{opt.icon}</span>
                <div>
                  <p className={`font-medium text-sm ${selected ? 'text-violet-900' : 'text-gray-800'}`}>{opt.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <Button
        className="w-full bg-violet-700 hover:bg-violet-800 text-white h-11 font-medium disabled:opacity-40"
        onClick={onNext}
        disabled={!value}
      >
        Continue
      </Button>
    </div>
  )
}
