'use client'

import { SubjectProperty, OtherProperty, PropertyUse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import CurrencyInput from '@/components/CurrencyInput'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const PROPERTY_USE_OPTIONS: { value: PropertyUse; label: string }[] = [
  { value: 'owner-occupied', label: 'Owner-Occupied' },
  { value: 'rental', label: 'Rental' },
  { value: 'secondary', label: 'Secondary / Vacation' },
]

function newProperty(): OtherProperty {
  return {
    id: Math.random().toString(36).slice(2),
    currentUse: '',
    address: '',
    annualPropertyTax: '',
    lender: '',
    mortgageBalance: '',
    mortgagePayment: '',
    maturityDate: '',
    hasSecondMortgage: false,
    secondMortgageType: 'mortgage',
    secondMortgageBalance: '',
    monthlyRentalIncome: '',
  }
}

interface OtherPropertyCardProps {
  prop: OtherProperty
  index: number
  onChange: (p: OtherProperty) => void
  onRemove: () => void
}

function OtherPropertyCard({ prop, index, onChange, onRemove }: OtherPropertyCardProps) {
  const [expanded, setExpanded] = useState(true)
  const set = <K extends keyof OtherProperty>(k: K, v: OtherProperty[K]) => onChange({ ...prop, [k]: v })

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 font-medium text-sm text-gray-700">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Property {index + 1}
          {prop.address && <span className="text-gray-400 font-normal ml-1">— {prop.address.split(',')[0]}</span>}
        </button>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input placeholder="456 Oak Ave, Calgary, AB" value={prop.address} onChange={(e) => set('address', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Current Use</Label>
            <Select value={prop.currentUse} onValueChange={(v) => set('currentUse', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {PROPERTY_USE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput label="Annual Property Tax" value={prop.annualPropertyTax} onChange={(v) => set('annualPropertyTax', v)} optional />
            <CurrencyInput label="Monthly Rental Income" value={prop.monthlyRentalIncome} onChange={(v) => set('monthlyRentalIncome', v)} optional />
          </div>

          <div className="space-y-1.5">
            <Label>Lender <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input placeholder="TD Bank" value={prop.lender} onChange={(e) => set('lender', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput label="Mortgage Balance" value={prop.mortgageBalance} onChange={(v) => set('mortgageBalance', v)} optional />
            <CurrencyInput label="Monthly Payment" value={prop.mortgagePayment} onChange={(v) => set('mortgagePayment', v)} optional />
          </div>

          <div className="space-y-1.5">
            <Label>Maturity Date <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input type="date" value={prop.maturityDate} onChange={(e) => set('maturityDate', e.target.value)} />
          </div>

          {/* Second Mortgage */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Checkbox
                id={`second-${prop.id}`}
                checked={prop.hasSecondMortgage}
                onCheckedChange={(v) => set('hasSecondMortgage', !!v)}
              />
              <label htmlFor={`second-${prop.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                Has a second mortgage or HELOC
              </label>
            </div>

            {prop.hasSecondMortgage && (
              <div className="space-y-4 pl-6">
                <div className="flex gap-2">
                  {(['mortgage', 'heloc'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => set('secondMortgageType', t)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        prop.secondMortgageType === t
                          ? 'border-violet-700 bg-violet-50 text-violet-800'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {t === 'mortgage' ? '2nd Mortgage' : 'HELOC'}
                    </button>
                  ))}
                </div>
                <CurrencyInput label="Balance" value={prop.secondMortgageBalance} onChange={(v) => set('secondMortgageBalance', v)} optional />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  data: SubjectProperty
  onChange: (data: SubjectProperty) => void
  onNext: () => void
  onBack: () => void
}

export default function Step6Properties({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof SubjectProperty>(k: K, v: SubjectProperty[K]) => onChange({ ...data, [k]: v })

  const addProperty = () => set('otherProperties', [...data.otherProperties, newProperty()])

  const updateProperty = (i: number, p: OtherProperty) => {
    const next = [...data.otherProperties]
    next[i] = p
    set('otherProperties', next)
  }

  const removeProperty = (i: number) => {
    const next = data.otherProperties.filter((_, idx) => idx !== i)
    set('otherProperties', next)
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Properties</h1>
      <p className="text-gray-500 mb-8">Tell us about the subject property and any others you own.</p>

      <div className="space-y-6">
        {/* Subject Property */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Subject Property</h3>
          <div className="space-y-1.5">
            <Label>Address <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input placeholder="123 Main St, Toronto, ON" value={data.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Intended Use <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Select value={data.propertyUse} onValueChange={(v) => set('propertyUse', v as PropertyUse)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {PROPERTY_USE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Other Properties */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Other Properties</h3>
          <div className="flex gap-3">
            {([true, false] as const).map((val) => (
              <button
                key={String(val)}
                onClick={() => set('hasOtherProperties', val)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  data.hasOtherProperties === val
                    ? 'border-violet-700 bg-violet-50 text-violet-800'
                    : 'border-gray-200 text-gray-600 hover:border-violet-300'
                }`}
              >
                {val ? 'Yes, I own other properties' : 'No other properties'}
              </button>
            ))}
          </div>

          {data.hasOtherProperties && (
            <div className="space-y-3 pt-2">
              {data.otherProperties.map((p, i) => (
                <OtherPropertyCard
                  key={p.id}
                  prop={p}
                  index={i}
                  onChange={(updated) => updateProperty(i, updated)}
                  onRemove={() => removeProperty(i)}
                />
              ))}
              <button
                onClick={addProperty}
                className="w-full py-3 border-2 border-dashed border-violet-300 rounded-xl text-sm font-medium text-violet-600 hover:border-violet-500 hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Property
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" className="flex-1 h-12" onClick={onBack}>← Back</Button>
        <Button className="flex-1 h-12 bg-violet-700 hover:bg-violet-800 text-white font-medium" onClick={onNext}>Continue →</Button>
      </div>
    </div>
  )
}
