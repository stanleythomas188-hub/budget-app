'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BudgetData, BudgetRow, SectionType, defaultData, fmt, sumRows, MONTHS } from '@/lib/data'
import SummaryCard from '@/components/SummaryCard'
import BudgetSection from '@/components/BudgetSection'
import ProgressBar from '@/components/ProgressBar'
import TrendChart from '@/components/TrendChart'

let idCounter = 100

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [data, setData] = useState<BudgetData>(defaultData())
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [trendData, setTrendData] = useState<any[]>([])
  const [showTrend, setShowTrend] = useState(false)
  const [toast, setToast] = useState('')

  const years = Array.from({ length: 3 }, (_, i) => now.getFullYear() - 1 + i)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    loadBudget()
  }, [user, selectedMonth, selectedYear])

  const loadBudget = async () => {
    const { data: rows } = await supabase
      .from('budgets')
      .select('data')
      .eq('month', selectedMonth)
      .eq('year', selectedYear)
      .single()
    if (rows?.data) {
      setData(rows.data as BudgetData)
    } else {
      setData(defaultData())
    }
    setSaved(false)
  }

  const saveBudget = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('budgets')
      .upsert({
        user_id: user.id,
        month: selectedMonth,
        year: selectedYear,
        data,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,month,year' })
    setSaving(false)
    if (!error) {
      setSaved(true)
      showToast(`${MONTHS[selectedMonth - 1]} ${selectedYear} saved`)
    }
  }

  const loadTrend = async () => {
    const { data: rows } = await supabase
      .from('budgets')
      .select('month, year, data')
      .order('year', { ascending: true })
      .order('month', { ascending: true })
    if (!rows) return
    const chart = rows.map((r: any) => {
      const d = r.data as BudgetData
      const income = sumRows(d.income)
      const expenses = sumRows(d.expense)
      const investments = sumRows(d.invest)
      return {
        month: MONTHS[r.month - 1].slice(0, 3) + ' ' + r.year,
        income, expenses, investments,
        leftover: income - expenses - investments,
      }
    })
    setTrendData(chart)
    setShowTrend(true)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const handleUpdate = useCallback((type: SectionType, id: string, field: 'name' | 'amount', val: string) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].map(r => r.id === id ? { ...r, [field]: field === 'amount' ? parseFloat(val) || 0 : val } : r),
    }))
    setSaved(false)
  }, [])

  const handleDelete = useCallback((type: SectionType, id: string) => {
    setData(prev => ({ ...prev, [type]: prev[type].filter(r => r.id !== id) }))
    setSaved(false)
  }, [])

  const handleAdd = useCallback((type: SectionType) => {
    const newRow: BudgetRow = { id: `${type}${idCounter++}`, name: '', amount: 0 }
    setData(prev => ({ ...prev, [type]: [...prev[type], newRow] }))
    setSaved(false)
  }, [])

  const handleClearSection = useCallback((type: SectionType) => {
    setData(prev => ({ ...prev, [type]: prev[type].map(r => ({ ...r, amount: 0 })) }))
    setSaved(false)
  }, [])

  const handleClearAll = useCallback(() => {
    setData(defaultData())
    setShowConfirm(false)
    setSaved(false)
  }, [])

  const income = sumRows(data.income)
  const expenses = sumRows(data.expense)
  const investments = sumRows(data.invest)
  const leftover = income - expenses - investments

  return (
    <div className="min-h-screen bg-[#F7F6F2] py-6 px-3 sm:py-10 sm:px-4">
      <div className="max-w-xl mx-auto">

        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#2C2C2A] text-white text-sm px-4 py-2 rounded-lg z-50 shadow-sm">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#2C2C2A] tracking-tight">Budget calculator</h1>
            <p className="text-xs text-[#888780] mt-1 truncate">{user?.email}</p>
          </div>
          <button onClick={handleSignOut} className="text-xs text-[#888780] border border-[#E8E7E2] rounded-lg px-3 py-2 hover:bg-white transition-colors whitespace-nowrap flex-shrink-0">
            Sign out
          </button>
        </div>

        {/* Month / Year selector */}
        <div className="bg-white border border-[#E8E7E2] rounded-2xl p-3 mb-5 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[#888780] uppercase tracking-wider mr-1">Budget for</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="text-sm font-medium text-[#2C2C2A] border border-[#E8E7E2] rounded-lg px-2 py-1.5 outline-none bg-white"
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="text-sm font-medium text-[#2C2C2A] border border-[#E8E7E2] rounded-lg px-2 py-1.5 outline-none bg-white"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={saveBudget}
              disabled={saving}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${saved ? 'bg-[#EAF3DE] text-[#3B6D11]' : 'bg-[#2C2C2A] text-white hover:bg-[#444441]'} disabled:opacity-50`}
            >
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save budget'}
            </button>
            <button onClick={() => setShowConfirm(true)} className="text-xs text-[#A32D2D] border border-[#F09595] rounded-lg px-2 py-1.5 hover:bg-[#FCEBEB] transition-colors">
              Clear
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="mb-5 bg-[#FCEBEB] border border-[#F09595] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-[#791F1F]">Reset all entries to zero. Are you sure?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="text-sm px-3 py-1.5 rounded-lg border border-[#F09595] text-[#A32D2D] hover:bg-[#F7C1C1] transition-colors">Cancel</button>
              <button onClick={handleClearAll} className="text-sm px-3 py-1.5 rounded-lg bg-[#A32D2D] text-white hover:bg-[#791F1F] transition-colors">Yes, clear</button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <SummaryCard label="Income" value={fmt(income)} theme="green" />
          <SummaryCard label="Expenses" value={fmt(expenses)} theme="red" />
          <SummaryCard label="Investments" value={fmt(investments)} theme="blue" />
          <SummaryCard label="Left over" value={(leftover < 0 ? '-' : '') + fmt(leftover)} theme={leftover >= 0 ? 'neutral' : 'red'} sub={leftover >= 0 ? 'available to save' : 'overspending'} />
        </div>

        <ProgressBar income={income} expenses={expenses} investments={investments} />

        {/* Budget sections */}
        <div className="mb-2">
          <p className="text-[11px] font-semibold text-[#888780] uppercase tracking-wider mb-2">Money in</p>
          <BudgetSection type="income" rows={data.income} onUpdate={handleUpdate} onDelete={handleDelete} onAdd={handleAdd} onClearSection={handleClearSection} />
        </div>

        <div className="mt-5 mb-2">
          <p className="text-[11px] font-semibold text-[#888780] uppercase tracking-wider mb-2">Money out</p>
          <div className="flex flex-col gap-3">
            <BudgetSection type="expense" rows={data.expense} onUpdate={handleUpdate} onDelete={handleDelete} onAdd={handleAdd} onClearSection={handleClearSection} />
            <BudgetSection type="invest" rows={data.invest} onUpdate={handleUpdate} onDelete={handleDelete} onAdd={handleAdd} onClearSection={handleClearSection} />
          </div>
        </div>

        {/* Trend chart */}
        <div className="mt-6">
          {!showTrend ? (
            <button onClick={loadTrend} className="w-full border border-[#E8E7E2] bg-white rounded-2xl py-3 text-sm font-medium text-[#888780] hover:bg-[#F7F6F2] transition-colors">
              Show monthly trend chart
            </button>
          ) : (
            <TrendChart data={trendData} />
          )}
        </div>

        <div className="mt-6 text-center text-xs text-[#B4B2A9]">
          Data saved securely per user. Nothing is shared.
        </div>
      </div>
    </div>
  )
}
