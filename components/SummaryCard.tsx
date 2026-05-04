'use client'

interface Props {
  label: string
  value: string
  theme: 'green' | 'red' | 'blue' | 'neutral'
  sub?: string
}

const themes = {
  green:   { bg: 'bg-[#EAF3DE]', label: 'text-[#3B6D11]', val: 'text-[#27500A]' },
  red:     { bg: 'bg-[#FCEBEB]', label: 'text-[#A32D2D]', val: 'text-[#791F1F]' },
  blue:    { bg: 'bg-[#E6F1FB]', label: 'text-[#185FA5]', val: 'text-[#0C447C]' },
  neutral: { bg: 'bg-[#EFEFEB]', label: 'text-[#5F5E5A]', val: 'text-[#2C2C2A]' },
}

export default function SummaryCard({ label, value, theme, sub }: Props) {
  const t = themes[theme]
  return (
    <div className={`${t.bg} rounded-xl p-2 sm:p-3 flex flex-col gap-1 min-w-0`}>
      <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wider truncate ${t.label}`}>{label}</span>
      <span className={`text-base sm:text-xl font-semibold ${t.val} tabular-nums truncate`}>{value}</span>
      {sub && <span className={`text-[10px] sm:text-[11px] ${t.label} opacity-70 truncate`}>{sub}</span>}
    </div>
  )
}
