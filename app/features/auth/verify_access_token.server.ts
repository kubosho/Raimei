import type { SupabaseClient } from '@supabase/supabase-js';

interface Params {
  accessToken: string;
  supabaseClient: SupabaseClient;
}

export async function verifyAccessToken({ accessToken, supabaseClient }: Params): Promise<string | null> {
  const { error } = await supabaseClient.auth.getUser(accessToken);
  if (error != null) {
    console.error(error.message);
    return null;
  }

  return accessToken;
}
