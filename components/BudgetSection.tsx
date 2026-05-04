'use client'

import { BudgetRow, SectionType, fmt } from '@/lib/data'

interface Props {
  type: SectionType
  rows: BudgetRow[]
  onUpdate: (type: SectionType, id: string, field: 'name' | 'amount', val: string) => void
  onDelete: (type: SectionType, id: string) => void
  onAdd: (type: SectionType) => void
  onClearSection: (type: SectionType) => void
}

const config = {
  income: {
    label: 'Income', bg: 'bg-[#EAF3DE]', title: 'text-[#27500A]', total: 'text-[#3B6D11]',
    divider: 'border-[#C0DD97]', inputText: 'text-[#27500A] placeholder-[#97C459]',
    amountBorder: 'border-[#97C459]', delColor: 'text-[#3B6D11] hover:text-[#791F1F]',
    addBorder: 'border-[#97C459] text-[#3B6D11] hover:bg-[#C0DD97]',
    clearColor: 'text-[#3B6D11] hover:bg-[#C0DD97]',
  },
  expense: {
    label: 'Expenses', bg: 'bg-[#FCEBEB]', title: 'text-[#791F1F]', total: 'text-[#A32D2D]',
    divider: 'border-[#F7C1C1]', inputText: 'text-[#791F1F] placeholder-[#F09595]',
    amountBorder: 'border-[#F09595]', delColor: 'text-[#A32D2D] hover:text-[#500000]',
    addBorder: 'border-[#F09595] text-[#A32D2D] hover:bg-[#F7C1C1]',
    clearColor: 'text-[#A32D2D] hover:bg-[#F7C1C1]',
  },
  invest: {
    label: 'Investments', bg: 'bg-[#E6F1FB]', title: 'text-[#0C447C]', total: 'text-[#185FA5]',
    divider: 'border-[#B5D4F4]', inputText: 'text-[#0C447C] placeholder-[#85B7EB]',
    amountBorder: 'border-[#85B7EB]', delColor: 'text-[#185FA5] hover:text-[#791F1F]',
    addBorder: 'border-[#85B7EB] text-[#185FA5] hover:bg-[#B5D4F4]',
    clearColor: 'text-[#185FA5] hover:bg-[#B5D4F4]',
  },
}

export default function BudgetSection({ type, rows, onUpdate, onDelete, onAdd, onClearSection }: Props) {
  const c = config[type]
  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0)

  return (
    <div className={`${c.bg} rounded-2xl overflow-hidden`}>
      <div className={`flex items-center justify-between px-3 sm:px-4 py-3 border-b ${c.divider}`}>
        <span className={`text-sm font-semibold ${c.title} truncate mr-2`}>{c.label}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onClearSection(type)} className={`text-xs px-2 py-1 rounded-md border ${c.divider} ${c.clearColor} transition-colors`}>Clear</button>
          <span className={`text-sm font-semibold tabular-nums ${c.total}`}>{fmt(total)}</span>
        </div>
      </div>
      <div className="px-3 sm:px-4 py-1">
        {rows.map((row, idx) => (
          <div key={row.id} className={`flex items-center gap-1 sm:gap-2 py-2 ${idx < rows.length - 1 ? `border-b ${c.divider}` : ''}`}>
            <input type="text" value={row.name} placeholder="Label" onChange={e => onUpdate(type, row.id, 'name', e.target.value)}
              className={`flex-1 min-w-0 bg-transparent border-none outline-none text-xs sm:text-sm font-medium ${c.inputText}`} />
            <span className={`text-xs sm:text-sm font-medium ${c.title} opacity-60 flex-shrink-0`}>£</span>
            <input type="number" value={row.amount === 0 ? '' : row.amount} placeholder="0" min={0}
              onChange={e => onUpdate(type, row.id, 'amount', e.target.value)}
              className={`w-16 sm:w-24 text-right bg-transparent border-b outline-none text-xs sm:text-sm font-medium tabular-nums ${c.inputText} ${c.amountBorder} pb-0.5 flex-shrink-0`} />
            <button onClick={() => onDelete(type, row.id)} className={`text-base leading-none opacity-40 hover:opacity-100 transition-opacity ${c.delColor} flex-shrink-0`}>×</button>
          </div>
        ))}
      </div>
      <div className="px-3 sm:px-4 pb-3 pt-1">
        <button onClick={() => onAdd(type)} className={`w-full border border-dashed rounded-lg py-2 text-xs sm:text-sm font-medium transition-colors ${c.addBorder}`}>
          + Add {type === 'invest' ? 'investment' : type === 'income' ? 'income' : 'expense'}
        </button>
      </div>
    </div>
  )
}
