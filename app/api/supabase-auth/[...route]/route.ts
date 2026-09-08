import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient({ getAll: () => [], setAll: () => {} } as any);
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data.session });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient({ getAll: () => [], setAll: () => {} } as any);

    let result: any;

    switch (body.action) {
      case 'signup':
        result = await supabase.auth.signUp({
          email: body.email,
          password: body.password,
          options: {
            data: {
              name: body.name,
            },
          },
        });
        break;
      case 'signin':
        result = await supabase.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        });
        break;
      case 'signout':
        result = await supabase.auth.signOut();
        break;
      case 'reset-password': {
        const resetResult = await supabase.auth.resetPasswordForEmail(body.email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
        });
        if (resetResult.error) {
          return NextResponse.json({ error: resetResult.error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
