import { useState, useEffect, useCallback, useRef } from 'react';

type FetchFn<T> = () => Promise<T>;

interface RealtimeQueryOptions<T> {
  fetchFn: FetchFn<T>;
  interval?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export function useRealtimeQuery<T>({
  fetchFn,
  interval = 30000,
  enabled = true,
  onError,
}: RealtimeQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setLoading(false);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setLoading(false);
        onError?.(error);
      }
    }
  }, [fetchFn, onError]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      fetchData();
      timerRef.current = setInterval(fetchData, interval);
    }

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, interval, fetchData]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refresh };
}
