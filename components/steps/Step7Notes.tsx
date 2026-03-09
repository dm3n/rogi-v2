'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Props {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
}

export default function Step7Notes({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Anything else?</h1>
      <p className="text-gray-400 text-sm mb-8">Credit history, unique circumstances, questions — anything at all.</p>

      <div className="space-y-1.5">
        <Label className="text-sm text-gray-600">Additional notes <span className="text-gray-400 font-normal">(optional)</span></Label>
        <Textarea
          placeholder="e.g. We have a firm closing date and need to move quickly."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[160px] resize-none"
        />
      </div>

      <Button
        className="mt-6 w-full bg-violet-700 hover:bg-violet-800 text-white h-11 font-medium"
        onClick={onNext}
      >
        Submit Application
      </Button>
      <button onClick={onBack} className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back
      </button>
    </div>
  )
}
