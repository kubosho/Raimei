import { createCookieSessionStorage } from '@remix-run/node';

import { SESSION_MAX_AGE } from '../../constants/session_max_age';

import type { SessionData, SessionFlashData } from './session_type.server';

const SESSION_KEY = process.env.SESSION_KEY as string;

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: '__session',

    // all of these are optional
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secrets: [SESSION_KEY],
    secure: true,
  },
});

export { getSession, commitSession, destroySession };
