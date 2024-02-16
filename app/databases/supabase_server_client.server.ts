import { createServerClient, parse, serialize } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../types/database.types';

interface Params {
  accessToken?: string;
  request: Request;
}

export function createSupabaseServerClient({ accessToken, request }: Params): SupabaseClient<Database> {
  const { env } = process;

  if (env.SUPABASE_ANON_KEY == null || env.SUPABASE_URL == null) {
    throw new Error('SUPABASE_ANON_KEY or SUPABASE_URL are not set. Please set environment variables.');
  }

  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env;
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabaseClient = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: accessToken != null,
    },
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return supabaseClient;
}
