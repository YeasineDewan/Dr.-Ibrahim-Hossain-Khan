import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('activity_log').insert(body).select().single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
