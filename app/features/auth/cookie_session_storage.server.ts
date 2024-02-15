import { createCookieSessionStorage } from '@remix-run/node';
import type { AuthError } from '@supabase/supabase-js';

type SessionData = {
  accessToken: string;
  userId: string;
};

type SessionFlashData = {
  error: AuthError;
};

const ONE_WEEK = 60 * 60 * 24 * 7;
const SESSION_KEY = process.env.SESSION_KEY as string;

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: '__session',

    // all of these are optional
    httpOnly: true,
    maxAge: ONE_WEEK,
    path: '/',
    sameSite: 'lax',
    secrets: [SESSION_KEY],
    secure: true,
  },
});

export { getSession, commitSession, destroySession };
