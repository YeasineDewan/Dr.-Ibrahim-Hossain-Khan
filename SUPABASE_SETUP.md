# Supabase Setup Guide

## 1. Install Dependencies
```bash
pnpm install @supabase/supabase-js @supabase/ssr
```

## 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

Get your credentials from:
- Supabase Dashboard > Project Settings > API
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Publishable key (anon)
- `SUPABASE_SECRET_KEY` - Secret key (service_role) - keep this server-side only!

## 3. Run Database Migration
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/migrations/20240101000000_clinic_schema.sql`
3. Paste and run in SQL Editor

This creates tables for:
- patients
- appointments
- prescriptions
- follow_ups
- chambers
- reviews
- notifications
- activity_log
- users
- gallery
- videos
- categories
- coupons

## 4. Usage

### Server Components
```tsx
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from('patients').select('*');

  return <div>{/* render data */}</div>;
}
```

### Client Components
```tsx
'use client';
import { createClient } from '@/utils/supabase/client';

export function ClientComponent() {
  const supabase = createClient();
  

}
```

### API Routes
```tsx
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient({ getAll: () => [], setAll: () => {} } as any);
  const { data } = await supabase.from('patients').select('*');
  return NextResponse.json({ data });
}
```

## 5. Authentication

The middleware at `middleware.ts` automatically refreshes Supabase auth sessions.

### Sign Up
```tsx
const supabase = createClient();
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});
```

### Sign In
```tsx
const supabase = createClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### Sign Out
```tsx
const supabase = createClient();
await supabase.auth.signOut();
```

## 6. Test the Setup
1. Start the dev server: `pnpm dev`
2. Visit `/supabase-test` to see a live query
3. Visit `/api/supabase-test` to test the API route

## 7. Next Steps
- Enable email auth in Supabase Dashboard > Authentication
- Configure OAuth providers if needed
- Set up Row Level Security (RLS) policies for production
- Enable real-time subscriptions if needed
- Set up storage buckets for documents/images
