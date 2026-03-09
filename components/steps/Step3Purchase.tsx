'use client'

import { PurchaseDetails } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CurrencyInput from '@/components/CurrencyInput'

const PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT']
const APPLICANTS = ['1','2','3','4+']

interface Props {
  data: PurchaseDetails
  onChange: (data: PurchaseDetails) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3Purchase({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof PurchaseDetails>(k: K, v: PurchaseDetails[K]) => onChange({ ...data, [k]: v })

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Purchase details</h1>
      <p className="text-gray-400 text-sm mb-8">All fields are optional.</p>

      <div className="space-y-4">
        <CurrencyInput label="Purchase Price" value={data.purchasePrice} onChange={(v) => set('purchasePrice', v)} optional />

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Down Payment <span className="text-gray-400 font-normal">(optional)</span></Label>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-gray-200 p-1 gap-1 shrink-0">
              {(['dollar', 'percent'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => set('downPaymentType', t)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    data.downPaymentType === t ? 'bg-violet-700 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'dollar' ? '$' : '%'}
                </button>
              ))}
            </div>
            <Input
              className="h-11"
              placeholder={data.downPaymentType === 'dollar' ? '100,000' : '20'}
              value={data.downPayment}
              onChange={(e) => set('downPayment', e.target.value.replace(/[^\d.]/g, ''))}
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Closing Date <span className="text-gray-400 font-normal">(optional)</span></Label>
          <Input type="date" value={data.closingDate} onChange={(e) => set('closingDate', e.target.value)} className="h-11" />
        </div>

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
