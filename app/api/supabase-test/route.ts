import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient({ getAll: () => [], setAll: () => {} } as any);

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to Supabase' },
      { status: 500 }
    );
  }
}
