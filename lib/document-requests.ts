import { ApplicationState, DocumentRequest } from './types'

export function generateDocumentList(state: ApplicationState): DocumentRequest[] {
  const docs: DocumentRequest[] = []

  // Always required
  docs.push({
    category: 'Identity',
    items: ['Valid government-issued photo ID (driver\'s licence or passport)'],
  })

  // Mortgage-type specific
  if (state.mortgageType === 'purchase') {
    docs.push({
      category: 'Property (Purchase)',
      items: [
        'Signed purchase agreement / offer to purchase',
        'MLS listing for the property',
      ],
    })
  }

  if (state.mortgageType === 'refinance') {
    docs.push({
      category: 'Property (Refinance)',
      items: [
        'Recent mortgage statement',
        'Property tax assessment / bill',
      ],
    })
  }

  if (state.mortgageType === 'renewal') {
    docs.push({
      category: 'Property (Renewal)',
      items: [
        'Current mortgage renewal offer / statement',
      ],
    })
  }

  // Employment documents
  const empType = state.income.employmentType
  if (empType === 'fulltime-salaried' || empType === 'fulltime-hourly' || empType === 'part-time' || empType === 'seasonal') {
    docs.push({
      category: 'Employment & Income',
      items: [
        '2 most recent pay stubs',
        'T4 slips for the last 2 years',
        'Letter of employment (confirming position, salary, and start date)',
      ],
    })
  } else if (empType === 'self-employed') {
    docs.push({
      category: 'Employment & Income (Self-Employed)',
      items: [
        'Notices of Assessment (NOA) for the last 2 years',
        'T1 General tax returns for the last 2 years',
        'Articles of Incorporation OR Master Business Licence',
        'Business bank statements (last 3 months)',
      ],
    })
  } else if (empType === 'retired') {
    docs.push({
      category: 'Income (Retired)',
      items: [
        'Notice of Assessment (NOA) OR T1 General for last year',
        'T4A slips (pension / RRSP income)',
        'Pension income statements or letters',
      ],
    })
  }

  // Other properties
  const otherProps = state.subjectProperty.otherProperties
  if (otherProps && otherProps.length > 0) {
    docs.push({
      category: `Other Properties (${otherProps.length})`,
      items: [
        'Annual property tax bills for each owned property',
        'Current mortgage statements for each property',
        otherProps.some(p => p.monthlyRentalIncome)
          ? 'Rental income documentation (lease agreements)'
          : '',
      ].filter(Boolean),
    })
  }

  return docs
}
