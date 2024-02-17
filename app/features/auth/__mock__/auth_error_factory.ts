import type { AuthError } from '@supabase/supabase-js';
import { Factory } from 'fishery';

export const AuthErrorFactory = Factory.define<Omit<AuthError, '__isAuthError'>>(() => ({
  message: 'invalid JWT',
  name: 'AuthError',
  status: 401,
}));
