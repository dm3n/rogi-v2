import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ApplicationState } from '@/lib/types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  const state: ApplicationState = await req.json()
  const supabase = getSupabase()

  // Flatten type-specific details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let typeDetails: any = {}
  if (state.mortgageType === 'purchase') typeDetails = state.purchase
  else if (state.mortgageType === 'preapproval') typeDetails = state.preapproval
  else if (state.mortgageType === 'refinance') typeDetails = state.refinance
  else if (state.mortgageType === 'renewal') typeDetails = state.renewal

  const numApplicants = (typeDetails as { numApplicants?: string }).numApplicants ?? ''
  const province = (typeDetails as { province?: string }).province ?? ''

  const { data, error } = await supabase
    .from('applications')
    .insert({
      full_name: state.personal.fullName || null,
      cell: state.personal.cell || null,
      email: state.personal.email || null,
      dob: state.personal.dob || null,
      sin: state.personal.sin || null,
      mortgage_type: state.mortgageType,
      type_details: typeDetails,
      // Income (moved from extended)
      employment_type: state.income.employmentType || null,
      company_name: state.income.companyName || null,
      job_title: state.income.jobTitle || null,
      annual_income: state.income.annualIncome || null,
      co_applicant_income: state.income.coApplicantIncome || null,
      co_applicant_employment_type: state.income.coApplicantEmploymentType || null,
      // Liabilities
      liabilities: state.liabilities,
      // Extended personal
      assets: state.extended.assets,
      current_address: state.extended.currentAddress || null,
      years_at_address: state.extended.yearsAtAddress || null,
      // Properties
      subject_property: state.subjectProperty,
      other_properties: state.subjectProperty.otherProperties,
      additional_notes: state.additionalNotes || null,
      num_applicants: numApplicants || null,
      province: province || null,
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
