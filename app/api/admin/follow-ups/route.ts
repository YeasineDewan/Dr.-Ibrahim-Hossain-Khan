import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('follow_ups').select('*').order('due_date', { ascending: true });
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
    const { data, error } = await supabase.from('follow_ups').insert(body).select().single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { id, ...updates } = body;
    const { data, error } = await supabase.from('follow_ups').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);
    const { error } = await supabase.from('follow_ups').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
