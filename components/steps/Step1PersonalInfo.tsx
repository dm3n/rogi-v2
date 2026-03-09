'use client'

import { PersonalInfo } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
  onNext: () => void
}

export default function Step1PersonalInfo({ data, onChange, onNext }: Props) {
  const set = (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value })

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Let&apos;s get started</h1>
      <p className="text-gray-400 text-sm mb-8">We&apos;ll have a broker reach out shortly.</p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Full Name</Label>
          <Input
            placeholder="Jane Smith"
            value={data.fullName}
            onChange={set('fullName')}
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Email</Label>
          <Input
            placeholder="jane@example.com"
            value={data.email}
            onChange={set('email')}
            type="email"
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Phone</Label>
          <Input
            placeholder="(416) 555-1234"
            value={data.cell}
            onChange={set('cell')}
            inputMode="tel"
            className="h-11"
          />
        </div>
      </div>

      <Button
        className="mt-8 w-full bg-violet-700 hover:bg-violet-800 text-white h-11 font-medium"
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  )
}
