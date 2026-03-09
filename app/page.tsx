'use client'

import { useState, useEffect } from 'react'
import { ApplicationState } from '@/lib/types'
import { getMaxPurchasePrice, parseRawDollars } from '@/lib/mortgage-calc'
import LeftPanel from '@/components/LeftPanel'
import TopBar from '@/components/TopBar'
import StepWrapper from '@/components/StepWrapper'
import Step1PersonalInfo from '@/components/steps/Step1PersonalInfo'
import Step2MortgageType from '@/components/steps/Step2MortgageType'
import Step3Purchase from '@/components/steps/Step3Purchase'
import Step3PreApproval from '@/components/steps/Step3PreApproval'
import Step3Refinance from '@/components/steps/Step3Refinance'
import Step3Renewal from '@/components/steps/Step3Renewal'
import Step4Income from '@/components/steps/Step4Income'
import Step4Decision from '@/components/steps/Step4Decision'
import Step5PersonalExtended from '@/components/steps/Step5PersonalExtended'
import Step6Properties from '@/components/steps/Step6Properties'
import Step7Notes from '@/components/steps/Step7Notes'
import Step8Confirmation from '@/components/steps/Step8Confirmation'

// ─── Step map ────────────────────────────────────────────────────────────────
// 1  Personal
// 2  Mortgage Type
// 3  Type Details (purchase / preapproval / refinance / renewal)
// 4  Income & Employment
// 5  Decision (submit now → 9 / fill more → 6)
// 6  Assets, Liabilities & Extended Personal
// 7  Properties
// 8  Notes
// 9  Buyer Power Report
const TOTAL_STEPS = 8  // steps before the final report

const STORAGE_KEY = 'rogi_application_state'

const initialState: ApplicationState = {
  step: 1,
  personal: { fullName: '', cell: '', email: '', dob: '', sin: '' },
  mortgageType: null,
  purchase: { purchasePrice: '', downPayment: '', downPaymentType: 'dollar', closingDate: '', numApplicants: '', province: '' },
  preapproval: { idealPurchasePrice: '', unknownPrice: false, downPayment: '', downPaymentType: 'dollar', numApplicants: '', province: '' },
  refinance: { estimatedValue: '', currentLoan: '', numApplicants: '', province: '' },
  renewal: { currentMortgageSize: '', numApplicants: '', province: '' },
  income: {
    employmentType: '',
    companyName: '',
    jobTitle: '',
    annualIncome: '',
    coApplicantIncome: '',
    coApplicantEmploymentType: '',
  },
  liabilities: {
    carPayment: '',
    studentLoan: '',
    creditCardMinPayment: '',
    otherMonthlyDebt: '',
  },
  extended: {
    currentAddress: '',
    yearsAtAddress: '',
    assets: { savingsChequing: '', stocksBonds: '', rrsps: '' },
  },
  subjectProperty: { address: '', propertyUse: '', hasOtherProperties: null, otherProperties: [] },
  additionalNotes: '',
  submitted: false,
}

async function submitApplication(state: ApplicationState) {
  try {
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    })
  } catch {
    // non-blocking
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNumApplicants(state: ApplicationState): string {
  switch (state.mortgageType) {
    case 'purchase': return state.purchase.numApplicants
    case 'preapproval': return state.preapproval.numApplicants
    case 'refinance': return state.refinance.numApplicants
    case 'renewal': return state.renewal.numApplicants
    default: return '1'
  }
}

function getDownPaymentDollars(state: ApplicationState): number {
  let purchasePrice = 0
  if (state.mortgageType === 'purchase') {
    purchasePrice = parseRawDollars(state.purchase.purchasePrice)
    if (state.purchase.downPaymentType === 'dollar') return parseRawDollars(state.purchase.downPayment)
    return Math.round(purchasePrice * (parseFloat(state.purchase.downPayment || '0') / 100))
  }
  if (state.mortgageType === 'preapproval') {
    purchasePrice = parseRawDollars(state.preapproval.idealPurchasePrice)
    if (state.preapproval.downPaymentType === 'dollar') return parseRawDollars(state.preapproval.downPayment)
    return Math.round(purchasePrice * (parseFloat(state.preapproval.downPayment || '0') / 100))
  }
  return 0
}

function getMaxAffordablePrice(state: ApplicationState): number {
  const totalIncome =
    parseRawDollars(state.income.annualIncome) + parseRawDollars(state.income.coApplicantIncome)
  if (totalIncome <= 0) return 0
  const monthlyDebts =
    parseRawDollars(state.liabilities.carPayment) +
    parseRawDollars(state.liabilities.studentLoan) +
    parseRawDollars(state.liabilities.creditCardMinPayment) +
    parseRawDollars(state.liabilities.otherMonthlyDebt)
  return getMaxPurchasePrice({
    annualIncome: totalIncome,
    downPayment: getDownPaymentDollars(state),
    monthlyDebts,
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [state, setState] = useState<ApplicationState>(initialState)
  const [hydrated, setHydrated] = useState(false)

  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as ApplicationState
        // If a previous session completed, start fresh
        if (!parsed.submitted) {
          setState(parsed)
        }
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Persist state on every change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state, hydrated])

  const setStep = (step: number) => setState((s) => ({ ...s, step }))

  const handleSubmit = async (nextStep: number) => {
    await submitApplication(state)
    setState((s) => ({ ...s, step: nextStep, submitted: true }))
    // Clear persisted state after submission
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
  }

  const maxAffordablePrice = getMaxAffordablePrice(state)

  const progressPct = state.step < 9 ? Math.round((state.step / TOTAL_STEPS) * 100) : 100

  const renderStep = () => {
    switch (state.step) {
      // ── Step 1: Personal ──────────────────────────────────────────────
      case 1:
        return (
          <Step1PersonalInfo
            data={state.personal}
            onChange={(personal) => setState((s) => ({ ...s, personal }))}
            onNext={() => setStep(2)}
          />
        )

      // ── Step 2: Mortgage Type ─────────────────────────────────────────
      case 2:
        return (
          <Step2MortgageType
            value={state.mortgageType}
            onChange={(mortgageType) => setState((s) => ({ ...s, mortgageType }))}
            onNext={() => setStep(3)}
          />
        )

      // ── Step 3: Type Details ──────────────────────────────────────────
      case 3:
        if (state.mortgageType === 'purchase') {
          return (
            <Step3Purchase
              data={state.purchase}
              onChange={(purchase) => setState((s) => ({ ...s, purchase }))}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )
        }
        if (state.mortgageType === 'preapproval') {
          return (
            <Step3PreApproval
              data={state.preapproval}
              onChange={(preapproval) => setState((s) => ({ ...s, preapproval }))}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )
        }
        if (state.mortgageType === 'refinance') {
          return (
            <Step3Refinance
              data={state.refinance}
              onChange={(refinance) => setState((s) => ({ ...s, refinance }))}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )
        }
        if (state.mortgageType === 'renewal') {
          return (
            <Step3Renewal
              data={state.renewal}
              onChange={(renewal) => setState((s) => ({ ...s, renewal }))}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )
        }
        return null

      // ── Step 4: Income & Employment ───────────────────────────────────
      case 4:
        return (
          <Step4Income
            data={state.income}
            numApplicants={getNumApplicants(state)}
            downPayment={getDownPaymentDollars(state)}
            onChange={(income) => setState((s) => ({ ...s, income }))}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )

      // ── Step 5: Decision ──────────────────────────────────────────────
      case 5:
        return (
          <Step4Decision
            personal={state.personal}
            onPersonalChange={(personal) => setState((s) => ({ ...s, personal }))}
            maxAffordablePrice={maxAffordablePrice}
            onSubmitNow={() => handleSubmit(9)}
            onFillMore={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        )

      // ── Step 6: Assets, Liabilities & Extended Personal ───────────────
      case 6:
        return (
          <Step5PersonalExtended
            data={state.extended}
            liabilities={state.liabilities}
            onChange={(extended) => setState((s) => ({ ...s, extended }))}
            onLiabilitiesChange={(liabilities) => setState((s) => ({ ...s, liabilities }))}
            onNext={() => setStep(7)}
            onBack={() => setStep(5)}
          />
        )

      // ── Step 7: Properties ────────────────────────────────────────────
      case 7:
        return (
          <Step6Properties
            data={state.subjectProperty}
            onChange={(subjectProperty) => setState((s) => ({ ...s, subjectProperty }))}
            onNext={() => setStep(8)}
            onBack={() => setStep(6)}
          />
        )

      // ── Step 8: Notes ─────────────────────────────────────────────────
      case 8:
        return (
          <Step7Notes
            value={state.additionalNotes}
            onChange={(additionalNotes) => setState((s) => ({ ...s, additionalNotes }))}
            onNext={() => handleSubmit(9)}
            onBack={() => setStep(7)}
          />
        )

      // ── Step 9: Buyer Power Report ────────────────────────────────────
      case 9:
        return <Step8Confirmation state={state} />

      default:
        return null
    }
  }

  if (!hydrated) return null

  return (
    <div className="flex min-h-screen">
      {/* Left panel — sticky sidebar */}
      <div className="hidden md:block w-80 lg:w-96 xl:w-[420px] shrink-0">
        <div className="sticky top-0 h-screen">
          <LeftPanel step={state.step} state={state} />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />

        {/* Progress bar */}
        {state.step < 9 && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-violet-700 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        {/* Step content */}
        <div className="flex-1 overflow-y-auto py-10 px-6 md:px-12">
          <StepWrapper step={state.step}>{renderStep()}</StepWrapper>
        </div>
      </div>
    </div>
  )
}
