import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';

import type { Database } from '../../types/database.types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  if (process.env.SUPABASE_URL == null || process.env.SUPABASE_ANON_KEY == null) {
    throw new Error('Please set SUPABASE_URL or SUPABASE_ANON_KEY.');
  }

  const supabaseClient = createServerClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    request,
    response,
  });

  await supabaseClient.auth.signOut();

  return redirect('/', {
    headers: response.headers,
  });
};
