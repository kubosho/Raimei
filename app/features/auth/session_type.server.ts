import type { AuthError } from '@supabase/supabase-js';

export type SessionData = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export type SessionFlashData = {
  error: AuthError;
};
