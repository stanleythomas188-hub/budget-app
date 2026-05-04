export type SectionType = 'income' | 'expense' | 'invest'

export interface BudgetRow {
  id: string
  name: string
  amount: number
}

export interface BudgetData {
  income: BudgetRow[]
  expense: BudgetRow[]
  invest: BudgetRow[]
}

let _id = 0
const uid = (prefix: string) => `${prefix}${_id++}`

export const defaultData = (): BudgetData => ({
  income: [
    { id: uid('i'), name: 'Salary', amount: 0 },
    { id: uid('i'), name: 'Freelance', amount: 0 },
  ],
  expense: [
    { id: uid('e'), name: 'Rent / mortgage', amount: 0 },
    { id: uid('e'), name: 'Groceries', amount: 0 },
    { id: uid('e'), name: 'Transport', amount: 0 },
    { id: uid('e'), name: 'Eating out', amount: 0 },
    { id: uid('e'), name: 'Loans', amount: 0 },
    { id: uid('e'), name: 'Credit cards', amount: 0 },
    { id: uid('e'), name: 'Council tax', amount: 0 },
    { id: uid('e'), name: 'Insurance', amount: 0 },
    { id: uid('e'), name: 'TV licence', amount: 0 },
    { id: uid('e'), name: 'Utility bills', amount: 0 },
    { id: uid('e'), name: 'Mobile', amount: 0 },
    { id: uid('e'), name: 'Broadband', amount: 0 },
    { id: uid('e'), name: 'Subscriptions', amount: 0 },
  ],
  invest: [
    { id: uid('v'), name: 'S&P 500 ISA', amount: 0 },
    { id: uid('v'), name: 'Pension top-up', amount: 0 },
  ],
})

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const fmt = (n: number): string =>
  '£' + Math.round(Math.abs(n)).toLocaleString('en-GB')

export const sumRows = (rows: BudgetRow[]): number =>
  rows.reduce((s, r) => s + (Number(r.amount) || 0), 0)
