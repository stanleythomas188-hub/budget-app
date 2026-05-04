# Budget Calculator v2

Full-stack budget calculator with authentication, per-user monthly budgets saved to a database, and a month-on-month trend chart.

## Features
- Email + password and Google sign-in
- Budgets saved per user, per month, per year
- Data isolated per user (row level security)
- Monthly trend chart (income, expenses, investments)
- Mobile responsive

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add environment variables
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://rsqakacjfviwgirzsgho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
```

### 3. Run locally
```bash
npm run dev
```

### 4. Deploy to Vercel
Push to GitHub and import to Vercel. Add the environment variables in Vercel's project settings under Environment Variables.

## Vercel Environment Variables
In Vercel → Project → Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
