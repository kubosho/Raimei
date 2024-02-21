import type { Session } from '@remix-run/node';
import { createServerClient } from '@supabase/ssr';
import { AuthError } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../types/database.types';
import { getSession } from '../features/auth/cookie_session_storage.server';
import type { SessionData, SessionFlashData } from '../features/auth/session_type.server';

async function updateAccessToken({
  refreshToken,
  supabaseClient,
}: {
  refreshToken: string;
  supabaseClient: SupabaseClient<Database>;
}): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });
  const accessToken = session?.access_token;

  if (accessToken == null || error != null) {
    return Promise.reject(new AuthError('Session expired, please login again', 401));
  }

  return accessToken;
}

async function verifyAccessToken({
  accessToken,
  supabaseClient,
}: {
  accessToken: string;
  supabaseClient: SupabaseClient<Database>;
}): Promise<string> {
  const { error } = await supabaseClient.auth.getUser(accessToken);
  if (error != null) {
    return Promise.reject(error);
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
  return await verifyAccessToken({ accessToken, supabaseClient })
    .catch(() => updateAccessToken({ refreshToken, supabaseClient }))
    .catch(() => null);
}

export async function createSupabaseServerClient(session?: Session<SessionData, SessionFlashData>): Promise<{
  session: Session<SessionData, SessionFlashData> | null;
  supabaseClient: SupabaseClient<Database> | null;
}> {
  const { env } = process;
  if (env.SUPABASE_ANON_KEY == null || env.SUPABASE_URL == null) {
    throw new Error('SUPABASE_ANON_KEY or SUPABASE_URL are not set. Please set environment variables.');
  }

  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env;

  const storedAccessToken = session?.get('accessToken');
  const storedRefreshToken = session?.get('refreshToken');
  if (session == null || storedAccessToken == null || storedRefreshToken == null) {
    const supabaseClient = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, { cookies: {} });
    return {
      session: null,
      supabaseClient,
    };
  }

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
    return {
      session: null,
      supabaseClient: null,
    };
  } else if (availableAccessToken === storedAccessToken) {
    return {
      session,
      supabaseClient,
    };
  } else if (availableAccessToken !== storedAccessToken) {
    const userId = session.get('userId');
    const newSession = await getSession();
    newSession.set('accessToken', availableAccessToken);
    newSession.set('refreshToken', storedRefreshToken);
    if (userId != null) {
      newSession.set('userId', userId);
    }

    const supabaseClient = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {},
      global: {
        headers: {
          Authorization: `Bearer ${availableAccessToken}`,
        },
      },
    });

    return {
      session: newSession,
      supabaseClient,
    };
  }

  return {
    session: null,
    supabaseClient: null,
  };
}
