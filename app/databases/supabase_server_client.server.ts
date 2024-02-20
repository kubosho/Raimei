import type { Session } from '@remix-run/node';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../types/database.types';
import type { SessionData, SessionFlashData } from '../features/auth/session_type';

async function updateAccessToken({
  refreshToken,
  supabaseClient,
}: {
  refreshToken: string;
  supabaseClient: SupabaseClient<Database>;
}): Promise<string | null> {
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

async function verifyAccessToken({
  accessToken,
  supabaseClient,
}: {
  accessToken: string;
  supabaseClient: SupabaseClient<Database>;
}): Promise<string | null> {
  const { error } = await supabaseClient.auth.getUser(accessToken);
  if (error != null) {
    console.error(error.message);
    return null;
  }

  return accessToken;
}

async function fetchAvailableAccessToken({
  accessToken,
  refreshToken,
  supabaseClient,
}: {
  accessToken: string;
  refreshToken: string;
  supabaseClient: SupabaseClient<Database>;
}): Promise<string | null> {
  const verifiedAccessToken = await verifyAccessToken({ accessToken, supabaseClient });
  if (verifiedAccessToken != null) {
    return verifiedAccessToken;
  }

  return await updateAccessToken({ refreshToken, supabaseClient });
}

export async function createSupabaseServerClient({
  session,
}: {
  session: Session<SessionData, SessionFlashData>;
}): Promise<SupabaseClient<Database> | null> {
  const storedAccessToken = session.get('accessToken');
  const storedRefreshToken = session.get('refreshToken');
  if (storedAccessToken == null || storedRefreshToken == null) {
    return null;
  }

  const { env } = process;
  if (env.SUPABASE_ANON_KEY == null || env.SUPABASE_URL == null) {
    throw new Error('SUPABASE_ANON_KEY or SUPABASE_URL are not set. Please set environment variables.');
  }

  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env;

  const supabaseClient = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {},
    global: {
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
      },
    },
  });

  const availableAccessToken = await fetchAvailableAccessToken({
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    supabaseClient,
  });
  if (availableAccessToken == null) {
    return null;
  } else if (availableAccessToken === storedAccessToken) {
    return supabaseClient;
  } else if (availableAccessToken !== storedAccessToken) {
    session.set('accessToken', availableAccessToken);
    return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {},
      global: {
        headers: {
          Authorization: `Bearer ${availableAccessToken}`,
        },
      },
    });
  }

  return null;
}
