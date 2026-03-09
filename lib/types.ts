export type MortgageType = 'purchase' | 'preapproval' | 'refinance' | 'renewal'
export type EmploymentType =
  | 'fulltime-salaried'
  | 'fulltime-hourly'
  | 'self-employed'
  | 'retired'
  | 'part-time'
  | 'seasonal'
export type PropertyUse = 'owner-occupied' | 'rental' | 'secondary'
export type SecondMortgageType = 'mortgage' | 'heloc'

export interface PersonalInfo {
  fullName: string
  cell: string
  email: string
  dob: string
  sin: string
}

export interface PurchaseDetails {
  purchasePrice: string
  downPayment: string
  downPaymentType: 'dollar' | 'percent'
  closingDate: string
  numApplicants: string
  province: string
}

export interface PreApprovalDetails {
  idealPurchasePrice: string
  unknownPrice: boolean
  downPayment: string
  downPaymentType: 'dollar' | 'percent'
  numApplicants: string
  province: string
}

export interface RefinanceDetails {
  estimatedValue: string
  currentLoan: string
  numApplicants: string
  province: string
}

export interface RenewalDetails {
  currentMortgageSize: string
  numApplicants: string
  province: string
}

/** Step 4 — Income & Employment */
export interface Income {
  employmentType: EmploymentType | ''
  companyName: string
  jobTitle: string
  annualIncome: string
  coApplicantIncome: string
  coApplicantEmploymentType: EmploymentType | ''
}

/** Monthly liabilities (for TDS calculation) */
export interface Liabilities {
  carPayment: string
  studentLoan: string
  creditCardMinPayment: string
  otherMonthlyDebt: string
}

export interface Assets {
  savingsChequing: string
  stocksBonds: string
  rrsps: string
}

/** Step 6 — Extended personal info */
export interface ExtendedPersonal {
  currentAddress: string
  yearsAtAddress: string
  assets: Assets
}

export interface OtherProperty {
  id: string
  currentUse: string
  address: string
  annualPropertyTax: string
  lender: string
  mortgageBalance: string
  mortgagePayment: string
  maturityDate: string
  hasSecondMortgage: boolean
  secondMortgageType: SecondMortgageType
  secondMortgageBalance: string
  monthlyRentalIncome: string
}

export interface SubjectProperty {
  address: string
  propertyUse: PropertyUse | ''
  hasOtherProperties: boolean | null
  otherProperties: OtherProperty[]
}

export interface ApplicationState {
  step: number
  personal: PersonalInfo
  mortgageType: MortgageType | null
  purchase: PurchaseDetails
  preapproval: PreApprovalDetails
  refinance: RefinanceDetails
  renewal: RenewalDetails
  income: Income
  liabilities: Liabilities
  extended: ExtendedPersonal
  subjectProperty: SubjectProperty
  additionalNotes: string
  submitted: boolean
}

export interface DocumentRequest {
  category: string
  items: string[]
}
