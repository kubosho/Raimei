import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../types/database.types';
import { useInstance } from '../../common_hooks/use_instance';

interface Params {
  accessToken: string | null;
  anonKey: string;
  url: string;
}

export const useSupabaseBrowserClient = ({ accessToken, anonKey, url }: Params): SupabaseClient<Database> | null => {
  const supabase = useInstance(
    createBrowserClient<Database>(url, anonKey, {
      cookies: {},
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }),
  );

  if (accessToken == null) {
    return null;
  }

  return supabase;
};
