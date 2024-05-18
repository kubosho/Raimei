import { createServerClient } from '@supabase/ssr';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../auto_generated_types/database.types';

import { getSupabaseEnvironmentVariables } from './supabase_environment_variables';

interface Params {
  session: Session | null;
}

export function createSupabaseServerClient({ session }: Params): SupabaseClient<Database> {
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = getSupabaseEnvironmentVariables();

  if (session == null) {
    return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {},
    });
  }

  const supabaseClient = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {},
    global: {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  });

  return supabaseClient;
}
