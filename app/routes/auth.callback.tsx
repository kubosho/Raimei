import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr';

import type { Database } from '../../types/database.types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  if (process.env.SUPABASE_URL == null || process.env.SUPABASE_ANON_KEY == null) {
    throw new Error('Please set SUPABASE_URL or SUPABASE_ANON_KEY.');
  }

  if (code) {
    const supabaseClient = createServerClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
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
    });
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  return redirect('/', {
    headers: response.headers,
  });
};
