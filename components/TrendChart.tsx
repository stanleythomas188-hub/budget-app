'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MONTHS } from '@/lib/data'

interface ChartEntry {
  month: string
  income: number
  expenses: number
  investments: number
  leftover: number
}

interface Props {
  data: ChartEntry[]
}

const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')

export default function TrendChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <div className="bg-[#EFEFEB] rounded-2xl p-6 text-center">
        <p className="text-sm text-[#888780]">Save at least 2 months of budgets to see your trend chart.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E8E7E2] rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-[#2C2C2A] mb-4">Monthly trend</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E2" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888780' }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={v => '£' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v)} tick={{ fontSize: 11, fill: '#888780' }} tickLine={false} axisLine={false} width={48} />
          <Tooltip formatter={(value: number) => fmt(value)} labelStyle={{ color: '#2C2C2A', fontWeight: 500 }} contentStyle={{ border: '0.5px solid #E8E7E2', borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line type="monotone" dataKey="income" name="Income" stroke="#3B6D11" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#A32D2D" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="investments" name="Investments" stroke="#185FA5" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="leftover" name="Left over" stroke="#888780" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
