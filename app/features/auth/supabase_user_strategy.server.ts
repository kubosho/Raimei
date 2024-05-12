import { createServerClient } from '@supabase/ssr';
import type { Session, User, WeakPassword } from '@supabase/supabase-js';
import { FormStrategy } from 'remix-auth-form';

import { Database } from '../../../types/database.types';
import { getSupabaseEnvironmentVariables } from '../../database/supabase_environment_variables';

export interface UserData {
  user: User;
  session: Session;
  weakPassword?: WeakPassword;
}

export function supabaseStrategy(): FormStrategy<UserData | null> {
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = getSupabaseEnvironmentVariables();

  return new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const supabaseClient = await createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {},
    });

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error != null) {
      throw error;
    }

    return data;
  });
}
