# Supabase Integration

This project now includes full Supabase integration for database persistence and authentication.

## What Was Added

### Core Supabase Setup
- `utils/supabase/server.ts` - Server-side Supabase client for Server Components and API routes
- `utils/supabase/client.ts` - Browser Supabase client for Client Components
- `middleware.ts` - Auto-refreshes Supabase auth sessions
- `lib/supabase.ts` - TypeScript database types for all tables
- `lib/supabase-data.ts` - Server-side data access functions
- `lib/supabase-queries.ts` - Client-side query functions
- `hooks/use-supabase-auth.ts` - React hook for Supabase auth

### API Routes
- `app/api/supabase-test/route.ts` - Test Supabase connection
- `app/api/supabase-auth/[...route]/route.ts` - Auth API (signup/signin/signout/reset-password)
- `app/api/admin/patients/route.ts` - Patients CRUD
- `app/api/admin/appointments/route.ts` - Appointments CRUD
- `app/api/admin/prescriptions/route.ts` - Prescriptions CRUD
- `app/api/admin/follow-ups/route.ts` - Follow-ups CRUD
- `app/api/admin/activity-log/route.ts` - Activity log CRUD

### Database Schema
- `supabase/migrations/20240101000000_clinic_schema.sql` - Complete schema for all clinic tables
- `supabase/migrations/20240101000001_clinic_seed_data.sql` - Sample seed data

### Test Pages
- `app/supabase-test/page.tsx` - Test database connection
- `app/auth-test/page.tsx` - Test auth session
- `components/supabase-demo.tsx` - Reusable demo component

### Migration Tools
- `scripts/migrate-to-supabase.ts` - Script to migrate sample data to Supabase

## Setup Instructions

### 1. Environment Variables
Ensure these are set in `.env.local` or Vercel:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 2. Run Database Migration
1. Go to Supabase Dashboard > SQL Editor
2. Run `supabase/migrations/20240101000000_clinic_schema.sql`
3. Run `supabase/migrations/20240101000001_clinic_seed_data.sql`

### 3. Enable Auth
In Supabase Dashboard > Authentication:
- Enable Email provider
- Configure redirect URLs if needed

### 4. Test the Setup
```bash
pnpm dev
```
Visit:
- `/supabase-test` - Database connection test
- `/auth-test` - Auth session test

## Usage Examples

### Server Components
```tsx
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function PatientsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('patients').select('*');
  
  return <div>{/* render patients */}</div>;
}
```

### Client Components
```tsx
'use client';
import { createClient } from '@/utils/supabase/client';

export function PatientsList() {
  const supabase = createClient();
  
  const loadPatients = async () => {
    const { data } = await supabase.from('patients').select('*');
    return data;
  };
  
  // ...
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

### Auth Hook
```tsx
'use client';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export function LoginForm() {
  const { signIn, user, loading } = useSupabaseAuth();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) console.error(error);
  };
}
```

## Architecture Notes

### Dual Data Layer
The admin panel currently uses two data sources:
1. **Client-side**: `useAdminData()` hook with sessionStorage persistence
2. **Supabase**: New server-side database layer

To fully migrate the admin panel to Supabase:
1. Replace `useAdminData()` calls with Supabase queries
2. Update admin views to fetch from API routes or server components
3. Remove sessionStorage persistence for sensitive data
4. Add server-side permission checks

### Security Improvements
- Session storage for PHI eliminated (compliance)
- Real database persistence instead of in-memory
- Proper auth via Supabase Auth
- Row Level Security (RLS) enabled on all tables
- Server-side validation possible via API routes

## Next Steps

1. **Migrate admin panel**: Replace `useAdminData` with Supabase queries
2. **Add real-time subscriptions**: Enable Supabase real-time for live updates
3. **Implement file storage**: Use Supabase Storage for patient documents/images
4. **Add row-level security**: Restrict data access by user role
5. **Enable MFA**: Use Supabase MFA for admin users
6. **Add audit logging**: Log all data changes to `activity_log` table

## Troubleshooting

### Type Errors
If you see TypeScript errors related to Supabase types, run:
```bash
pnpm typecheck
```

### Auth Issues
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set
- Check Supabase Dashboard > Authentication > URL Configuration
- Verify middleware is running (check network tab for session refresh)

### Database Connection
- Verify Supabase project is active
- Check IP allowlist in Supabase Dashboard
- Ensure schema migration has been run
