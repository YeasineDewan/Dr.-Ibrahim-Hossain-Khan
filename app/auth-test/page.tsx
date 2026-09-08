import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function AuthTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getSession();

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Supabase Auth Test</h1>
      {error && (
        <div style={{ padding: '1rem', background: '#fee', borderRadius: '8px', marginBottom: '1rem' }}>
          Error: {error.message}
        </div>
      )}
      {data?.session ? (
        <div style={{ padding: '1rem', background: '#efe', borderRadius: '8px' }}>
          <h2>Authenticated</h2>
          <p><strong>Email:</strong> {data.session.user.email}</p>
          <p><strong>ID:</strong> {data.session.user.id}</p>
        </div>
      ) : (
        <div style={{ padding: '1rem', background: '#eef', borderRadius: '8px' }}>
          <h2>Not authenticated</h2>
          <p>Sign in to test Supabase auth.</p>
        </div>
      )}
    </div>
  );
}
