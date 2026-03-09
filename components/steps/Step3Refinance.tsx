'use client'

import { RefinanceDetails } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import CurrencyInput from '@/components/CurrencyInput'

const PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT']
const APPLICANTS = ['1','2','3','4+']

interface Props {
  data: RefinanceDetails
  onChange: (data: RefinanceDetails) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3Refinance({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof RefinanceDetails>(k: K, v: RefinanceDetails[K]) => onChange({ ...data, [k]: v })

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Refinance details</h1>
      <p className="text-gray-400 text-sm mb-8">All fields are optional.</p>

      <div className="space-y-4">
        <CurrencyInput label="Estimated Property Value" value={data.estimatedValue} onChange={(v) => set('estimatedValue', v)} optional />
        <CurrencyInput label="Current Mortgage Balance" value={data.currentLoan} onChange={(v) => set('currentLoan', v)} optional />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Applicants</Label>
            <Select value={data.numApplicants} onValueChange={(v) => set('numApplicants', v)}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{APPLICANTS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Province</Label>
            <Select value={data.province} onValueChange={(v) => set('province', v)}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button className="mt-8 w-full bg-violet-700 hover:bg-violet-800 text-white h-11 font-medium" onClick={onNext}>Continue</Button>
      <button onClick={onBack} className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">← Back</button>
    </div>
  )
}
