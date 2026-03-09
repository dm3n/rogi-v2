'use client'

import { ArrowRight, ShieldCheck, Users, TrendingUp, DollarSign, Clock, Zap } from 'lucide-react'
import Link from 'next/link'

export default function BuildoutPage() {
  function scrollToFunnel(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    document.getElementById('funnel')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* Nav */}
      <header className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight text-gray-900">ROGI</span>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Open Application <ArrowRight className="w-3 h-3" />
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-20">

        {/* Hero */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 mb-8">
            FTHB Acquisition Funnel
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-snug mb-4">
            Canada&apos;s fastest<br />mortgage pre-approval.
          </h1>
          <p className="text-base text-gray-500 leading-relaxed max-w-lg mb-8">
            An AI-native intake system that turns cold ad clicks into fully underwritten borrower files — before a broker ever picks up the phone.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Try the application <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a href="#funnel" onClick={scrollToFunnel} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              See the funnel ↓
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-20">
          {[
            { value: '15 min', label: 'Avg. intake' },
            { value: '80%', label: 'Complete at hand-off' },
            { value: '0', label: 'Manual touches' },
            { value: '3–4×', label: 'Target ROI' },
          ].map(s => (
            <div key={s.label} className="bg-white px-5 py-5">
              <div className="text-xl font-bold text-violet-700 tracking-tight">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div id="funnel" className="mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-6">The Funnel</p>

          <div className="space-y-px border border-gray-100 rounded-xl overflow-hidden">

            {/* Step 1 */}
            <div className="bg-white px-6 py-6 border-b border-gray-100">
              <div className="flex items-start gap-5">
                <span className="text-xs font-semibold text-violet-400 w-4 shrink-0 mt-0.5">01</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">High-Intent Ad</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">Meta / Google</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    &ldquo;Stop waiting 48 hours for a broker to call back. Get a bank-ready <span className="text-gray-700 font-medium">Income Audit</span> in 15 minutes.&rdquo;
                  </p>
                  <span className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                    CTA: Verify My Buying Power
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white px-6 py-6 border-b border-gray-100">
              <div className="flex items-start gap-5">
                <span className="text-xs font-semibold text-violet-400 w-4 shrink-0 mt-0.5">02</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Autonomous Intake</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">ROGI AI</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Lead submits basic info at <span className="text-gray-700 font-medium">apply.rogi.ca</span>. ROGI instantly sends a secure upload link via SMS and email.
                  </p>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                    <p className="text-xs font-medium text-gray-400 mb-1.5">AI nudge sequence</p>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      &ldquo;I&apos;ve got your ID, but I need your 2024 NOA to unlock your max budget. Upload a photo now.&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Re-prompts continuously until all documents are collected.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white px-6 py-6 border-b border-gray-100">
              <div className="flex items-start gap-5">
                <span className="text-xs font-semibold text-violet-400 w-4 shrink-0 mt-0.5">03</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Instant Underwrite</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">Automated</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-5">
                    Within minutes of the final document upload, the broker receives a structured audit package. Here&apos;s exactly what it contains.
                  </p>

                  {/* Mock broker report */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">

                    {/* Report header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Verified Borrower Audit — First Draft</p>
                        <p className="text-xs text-gray-400 mt-0.5">Generated automatically · Ready for broker review</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                        <span className="text-xs font-medium text-green-700">Fraud check passed</span>
                      </div>
                    </div>

                    {/* Section 1 — Borrower Profile */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">01 · Borrower Profile</p>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
                        {[
                          { label: 'Full name', value: 'Sarah M. Chen' },
                          { label: 'Phone', value: '+1 (416) 555-0182' },
                          { label: 'Email', value: 'sarah.chen@email.com' },
                          { label: 'Employment type', value: 'T4 — Full-time' },
                          { label: 'Employer', value: 'Maple Financial Inc.' },
                          { label: 'Years employed', value: '3.5 years' },
                          { label: 'Application date', value: 'Today, 9:14 AM' },
                          { label: 'Mortgage type', value: 'Pre-approval' },
                          { label: 'Co-applicant', value: 'None' },
                        ].map(r => (
                          <div key={r.label}>
                            <p className="text-xs text-gray-400">{r.label}</p>
                            <p className="text-xs font-semibold text-gray-800 mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2 — Income Verification */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">02 · Income Verification</p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                          <p className="text-xs text-green-600 mb-0.5">Verified gross income</p>
                          <p className="text-xl font-bold text-green-800 tracking-tight">$112,000 / yr</p>
                          <p className="text-xs text-green-500 mt-0.5">2024 NOA confirmed · paystub consistent</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                          <p className="text-xs text-gray-400 mb-0.5">2-year average (2023–2024)</p>
                          <p className="text-xl font-bold text-gray-800 tracking-tight">$108,500 / yr</p>
                          <p className="text-xs text-gray-400 mt-0.5">Trending up · no material variance</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
                        {[
                          { label: 'Income source', value: 'Base salary + bonus' },
                          { label: 'Bonus (excluded)', value: '$8,000 — not guaranteed' },
                          { label: 'Stress test rate', value: '7.25% (5.25% + 2%)' },
                          { label: 'Monthly gross', value: '$9,333' },
                          { label: 'Monthly debts', value: '$485 (car + card)' },
                          { label: 'Net qualifying income', value: '$8,848 / mo' },
                        ].map(r => (
                          <div key={r.label}>
                            <p className="text-xs text-gray-400">{r.label}</p>
                            <p className="text-xs font-semibold text-gray-800 mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3 — Buying Power */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">03 · Buying Power Analysis</p>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {[
                          { label: 'Max purchase price', value: '$624,000', sub: 'At stress test rate', highlight: true },
                          { label: 'Down payment (verified)', value: '$65,000', sub: '10.4% of max purchase', highlight: false },
                          { label: 'Est. monthly payment', value: '$3,210 / mo', sub: 'P&I + tax + heat', highlight: false },
                        ].map(r => (
                          <div key={r.label} className={`rounded-lg px-4 py-3 border ${r.highlight ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-100'}`}>
                            <p className={`text-xs mb-0.5 ${r.highlight ? 'text-violet-500' : 'text-gray-400'}`}>{r.label}</p>
                            <p className={`text-base font-bold tracking-tight ${r.highlight ? 'text-violet-800' : 'text-gray-800'}`}>{r.value}</p>
                            <p className={`text-xs mt-0.5 ${r.highlight ? 'text-violet-400' : 'text-gray-400'}`}>{r.sub}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                        {[
                          { label: 'GDS ratio', value: '28.4%', ok: true },
                          { label: 'GDS limit', value: '39%', ok: true },
                          { label: 'TDS ratio', value: '33.1%', ok: true },
                          { label: 'TDS limit', value: '44%', ok: true },
                          { label: 'CMHC insured?', value: 'No — 10%+ down', ok: true },
                          { label: 'Amortization', value: '25 years', ok: true },
                          { label: 'Product type', value: 'Conventional', ok: true },
                          { label: 'Lender tier', value: 'A-lender eligible', ok: true },
                        ].map(r => (
                          <div key={r.label}>
                            <p className="text-xs text-gray-400">{r.label}</p>
                            <p className="text-xs font-semibold text-gray-800 mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 4 — Credit & Liabilities */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">04 · Credit & Liabilities</p>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
                        {[
                          { label: 'Credit score', value: '740' },
                          { label: 'Credit bureau', value: 'Equifax (pulled)' },
                          { label: 'Open accounts', value: '4 active' },
                          { label: 'Car payment', value: '$385 / mo' },
                          { label: 'Credit card min.', value: '$100 / mo' },
                          { label: 'Student loans', value: 'None' },
                          { label: 'Other debts', value: 'None' },
                          { label: 'Total monthly debts', value: '$485 / mo' },
                          { label: 'Derogatory marks', value: 'None found' },
                        ].map(r => (
                          <div key={r.label}>
                            <p className="text-xs text-gray-400">{r.label}</p>
                            <p className="text-xs font-semibold text-gray-800 mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 5 — Document Checklist */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">05 · Document Checklist</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: 'Government-issued photo ID', status: 'verified' },
                          { label: '2024 Notice of Assessment (NOA)', status: 'verified' },
                          { label: '2023 Notice of Assessment (NOA)', status: 'verified' },
                          { label: 'Most recent paystub', status: 'verified' },
                          { label: 'Second most recent paystub', status: 'verified' },
                          { label: 'Employment letter', status: 'verified' },
                          { label: '90-day bank statements (down payment)', status: 'verified' },
                          { label: 'Gift letter', status: 'n/a' },
                          { label: 'Self-employment financials', status: 'n/a' },
                          { label: 'Subject property (if applicable)', status: 'pending' },
                        ].map(r => (
                          <div key={r.label} className="flex items-center gap-2.5">
                            <span className={`text-xs font-bold w-14 shrink-0 ${
                              r.status === 'verified' ? 'text-green-600' :
                              r.status === 'pending' ? 'text-amber-600' : 'text-gray-300'
                            }`}>
                              {r.status === 'verified' ? '✓ Done' : r.status === 'pending' ? '○ TBD' : '— N/A'}
                            </span>
                            <span className="text-xs text-gray-500">{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 6 — Fraud & Metadata */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">06 · Fraud & Metadata Check</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: 'Paystub metadata consistent with employer', ok: true },
                          { label: 'NOA income matches paystub to within 5%', ok: true },
                          { label: 'Document creation date plausible', ok: true },
                          { label: 'Font / formatting anomaly scan', ok: true },
                          { label: 'Bank statement originator verified', ok: true },
                          { label: 'Address consistency across documents', ok: true },
                        ].map(r => (
                          <div key={r.label} className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-green-600 w-6 shrink-0">✓</span>
                            <span className="text-xs text-gray-500">{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 7 — Broker recommendation */}
                    <div className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3">07 · Broker Recommendation</p>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
                        {[
                          { label: 'Lender tier', value: 'A-lender (bank / monoline)' },
                          { label: 'Suggested product', value: '5-yr fixed, conventional' },
                          { label: 'Best rate estimate', value: '5.09% – 5.29%' },
                          { label: 'Priority', value: 'High — file is clean' },
                          { label: 'Next step', value: 'Send to lender for approval' },
                          { label: 'Broker action required', value: 'Review & sign off' },
                        ].map(r => (
                          <div key={r.label}>
                            <p className="text-xs text-gray-400">{r.label}</p>
                            <p className="text-xs font-semibold text-gray-800 mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white px-6 py-6">
              <div className="flex items-start gap-5">
                <span className="text-xs font-semibold text-violet-400 w-4 shrink-0 mt-0.5">04</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Ready-to-Close Hand-off</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">The Payday</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-4">
                    <p className="text-xs font-medium text-gray-400 mb-1.5">Broker alert</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      &ldquo;Lead [Name] is 100% Underwritten. Verified Income: <span className="font-semibold text-gray-800">$112k</span>. Down Payment: <span className="font-semibold text-gray-800">$65k</span>. Credit Score: <span className="font-semibold text-gray-800">740</span>. Audit package attached.&rdquo;
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Added to Velocity (LOS)', 'Synced to Zoho CRM', '80% complete file', 'Broker notified instantly'].map(t => (
                      <span key={t} className="text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ROI */}
        <div className="mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-6">The ROI</p>
          <div className="mb-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">$4k/mo opex. 3–4× return.</h2>
            <p className="text-sm text-gray-400">$2,500 ad spend + $1,500 ROGI management fee</p>
          </div>

          {/* Conversion funnel */}
          <div className="border border-gray-100 rounded-xl overflow-hidden mt-6 mb-6">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">Conversion funnel — $2,500 ad spend / month</p>
              <p className="text-xs text-gray-400">~$5 avg. cost per click</p>
            </div>

            {/* Funnel steps */}
            {[
              {
                stage: 'Ad clicks',
                n: 500,
                rate: null,
                rateLabel: null,
                bar: 100,
                desc: '$2,500 ÷ $5 CPC',
              },
              {
                stage: 'Applications started',
                n: 75,
                rate: '15%',
                rateLabel: 'click → submit',
                bar: 15,
                desc: 'Land on apply.rogi.ca and enter basic info',
              },
              {
                stage: 'Documents uploaded',
                n: 22,
                rate: '30%',
                rateLabel: 'submit → upload',
                bar: 4.5,
                desc: 'AI nudge sequence drives doc collection',
              },
              {
                stage: 'Verified profiles',
                n: 20,
                rate: '90%',
                rateLabel: 'docs → verified',
                bar: 4,
                desc: 'Fraud check passed · income confirmed',
              },
            ].map((row, i) => (
              <div key={row.stage} className={`px-5 py-4 ${i < 3 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-900 tracking-tight w-10 shrink-0">{row.n}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{row.stage}</p>
                      <p className="text-xs text-gray-400">{row.desc}</p>
                    </div>
                  </div>
                  {row.rate && (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-500">{row.rate}</p>
                      <p className="text-xs text-gray-300">{row.rateLabel}</p>
                    </div>
                  )}
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-400 transition-all"
                    style={{ width: `${row.bar}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Arrow into scenarios */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 mb-3">20 verified profiles handed to broker · close rate determines outcome</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="text-center shrink-0 w-10">
                    <p className="text-lg font-bold text-gray-900">2</p>
                    <p className="text-xs text-gray-400">deals</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">10% close rate</p>
                    <p className="text-xs text-gray-400">Conservative · cold leads</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="text-center shrink-0 w-10">
                    <p className="text-lg font-bold text-gray-900">4</p>
                    <p className="text-xs text-gray-400">deals</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">20% close rate</p>
                    <p className="text-xs text-gray-400">Target · verified + nudged</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8 mt-0">
            <div className="border border-gray-100 rounded-xl p-6">
              <p className="text-xs font-medium text-gray-400 mb-3">Low end · 2 deals/mo</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight mb-1">$7–10k</p>
              <p className="text-xs text-gray-400">Commission / month</p>
              <div className="mt-4 inline-block text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                Small profit
              </div>
            </div>
            <div className="border border-gray-900 rounded-xl p-6 bg-gray-900">
              <p className="text-xs font-medium text-gray-400 mb-3">Target · 4 deals/mo</p>
              <p className="text-3xl font-bold text-white tracking-tight mb-1">$14–20k</p>
              <p className="text-xs text-gray-400">Commission / month</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-200 bg-gray-700 px-2.5 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> 3× – 4× ROI
              </div>
            </div>
          </div>

          {/* Why this wins */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Why this wins</p>
            </div>
            {[
              { icon: <Clock className="w-3.5 h-3.5" />, title: 'Zero manual labor', desc: 'The broker doesn\'t touch the file until it\'s 80% complete and verified.' },
              { icon: <TrendingUp className="w-3.5 h-3.5" />, title: 'Higher conversion', desc: 'Borrowers stay in the funnel because they get instant value — their Buyer Power Report immediately.' },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, title: 'Lead quality', desc: 'You\'re not handing brokers names — you\'re handing them audited, verified files.' },
              { icon: <Users className="w-3.5 h-3.5" />, title: 'Velocity capacity', desc: 'A single broker can manage 50 active leads instead of 10.' },
              { icon: <DollarSign className="w-3.5 h-3.5" />, title: 'Data dominance', desc: 'Every lead becomes a Verified Profile in Zoho for future re-marketing and nurture campaigns.' },
              { icon: <Zap className="w-3.5 h-3.5" />, title: 'AI-native stack', desc: 'SMS/email nudge sequences, fraud checks, stress test underwriting — automated end to end.' },
            ].map((w, i, arr) => (
              <div key={w.title} className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="text-violet-500 shrink-0 mt-0.5">{w.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{w.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The build */}
        <div className="mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-6">The Application</p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">8-step wizard. Built in Next.js.</h2>
          <p className="text-sm text-gray-400 mb-8">
            A guided intake that collects and validates borrower data in under 15 minutes.
          </p>

          <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
            {[
              { step: '01', label: 'Personal Info', desc: 'Name, contact, SIN' },
              { step: '02', label: 'Mortgage Type', desc: 'Purchase, refi, pre-approval' },
              { step: '03', label: 'Type Details', desc: 'Price, down payment, property' },
              { step: '04', label: 'Quick Submit', desc: 'Or continue for extended profile' },
              { step: '05', label: 'Extended Personal', desc: 'Income, employment, debts' },
              { step: '06', label: 'Properties', desc: 'Current real estate' },
              { step: '07', label: 'Notes', desc: 'Broker context, special cases' },
              { step: '08', label: 'Confirmation', desc: 'Summary + dynamic doc checklist' },
            ].map((s, i, arr) => (
              <div key={s.step} className={`flex items-center gap-5 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-xs font-semibold text-violet-400 w-5 shrink-0">{s.step}</span>
                <span className="text-sm font-medium text-gray-900 w-40 shrink-0">{s.label}</span>
                <span className="text-xs text-gray-400">{s.desc}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {['Next.js 16', 'TypeScript', 'Tailwind v4', 'shadcn/ui', 'Supabase', 'Real-time mortgage calc', 'GDS/TDS validation', 'Stress test engine', 'Dynamic doc checklist'].map(t => (
              <span key={t} className="text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-md">{t}</span>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Open the application <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <footer className="border-t border-gray-100 px-8 py-6 text-center">
        <p className="text-xs text-gray-300">ROGI · Powered by Airbank Advisory · Confidential</p>
      </footer>

    </div>
  )
}
