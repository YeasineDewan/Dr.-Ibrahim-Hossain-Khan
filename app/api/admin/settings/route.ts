import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('settings').select('*').single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminAuth();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('settings').upsert(body).select().single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
