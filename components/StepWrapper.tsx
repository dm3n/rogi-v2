'use client'

import { useEffect, useState } from 'react'

interface StepWrapperProps {
  step: number
  children: React.ReactNode
}

export default function StepWrapper({ step, children }: StepWrapperProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      {children}
    </div>
  )
}
