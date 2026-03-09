'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CurrencyInputProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  optional?: boolean
}

function formatCurrency(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('en-CA')
}

export default function CurrencyInput({ label, value, onChange, placeholder = '0', optional }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    onChange(raw)
  }

  const display = value ? formatCurrency(value) : ''

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <Input
          className="pl-7"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          inputMode="numeric"
        />
      </div>
    </div>
  )
}
