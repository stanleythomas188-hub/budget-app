'use client'

interface Props {
  income: number
  expenses: number
  investments: number
}

export default function ProgressBar({ income, expenses, investments }: Props) {
  const totalOut = expenses + investments
  const pct = income > 0 ? Math.min(Math.round((totalOut / income) * 100), 100) : 0
  const savRate = income > 0 ? Math.max(0, Math.round((investments / income) * 100)) : 0
  const barColor = pct > 90 ? 'bg-[#E24B4A]' : pct > 70 ? 'bg-[#BA7517]' : 'bg-[#639922]'

  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-[#888780] mb-2">
        <span>Spending {pct}% of income</span>
        <span>Saving &amp; investing {savRate}%</span>
      </div>
      <div className="h-2 bg-[#E8E7E2] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
