import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function SupabaseTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .limit(10);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Supabase Test</h1>
      {error && (
        <div style={{ padding: '1rem', background: '#fee', borderRadius: '8px', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error.message}
        </div>
      )}
      {data && data.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.map((todo: any) => (
            <li
              key={todo.id}
              style={{
                padding: '1rem',
                marginBottom: '0.5rem',
                background: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            >
              <strong>{todo.name}</strong>
              {todo.description && <p style={{ margin: '0.5rem 0 0', color: '#666' }}>{todo.description}</p>}
              <small style={{ color: '#999' }}>
                {todo.created_at && new Date(todo.created_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#666' }}>No todos found. Create some in your Supabase dashboard!</p>
      )}
    </div>
  );
}
