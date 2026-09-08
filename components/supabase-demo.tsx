'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export function SupabaseDemo() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .limit(5);

      if (error) {
        setError(error.message);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h3>Supabase Patients Demo</h3>
      {data.length === 0 ? (
        <p>No patients found. Run the SQL migration in Supabase.</p>
      ) : (
        <ul>
          {data.map((patient) => (
            <li key={patient.id}>{patient.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
