import type { Session, User, WeakPassword } from '@supabase/supabase-js';
import { FormStrategy } from 'remix-auth-form';

import { createSupabaseServerClient } from '../../database/supabase_server_client.server';

export interface UserData {
  user: User;
  session: Session;
  weakPassword?: WeakPassword;
}

export function supabaseStrategy(): FormStrategy<UserData | null> {
  return new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const supabaseClient = createSupabaseServerClient({ session: null });

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error != null) {
      throw error;
    }

    return data;
  });
}
