import type { SupabaseClient } from '@supabase/supabase-js';

interface Params {
  refreshToken: string;
  supabaseClient: SupabaseClient;
}

export async function updateAccessToken({ refreshToken, supabaseClient }: Params): Promise<string | null> {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });
  const accessToken = session?.access_token;

  if (accessToken == null || error != null) {
    console.error('Session expired. Please login again.');
    return null;
  }

  return accessToken;
}
