import type { AuthError } from '@supabase/supabase-js';
import { Factory } from 'fishery';

export const AuthErrorFactory = Factory.define<Omit<AuthError, '__isAuthError'>>(() => ({
  message: 'invalid JWT: unable to parse or verify signature, token is expired by 1h00m10s',
  name: 'AuthError',
  status: 401,
}));
