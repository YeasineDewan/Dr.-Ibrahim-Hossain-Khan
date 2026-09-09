'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return createBrowserClient(supabaseUrl, supabaseKey, {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    });
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined;
          return document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1];
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') return;
          document.cookie = `${name}=${value}; path=/; ${options.sameSite ? `SameSite=${options.sameSite};` : ''} ${options.secure ? 'Secure;' : ''}`;
        },
        remove(name: string) {
          if (typeof document === 'undefined') return;
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    },
  );
};
