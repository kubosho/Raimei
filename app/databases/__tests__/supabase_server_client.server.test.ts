import { AuthError } from '@supabase/supabase-js';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { getSession } from '../../features/auth/__mock__/cookie_session_storage_mock';
import { SessionFactory } from '../../features/auth/__mock__/session_factory';
import { UserFactory } from '../../features/auth/__mock__/user_factory';
import { createSupabaseServerClient } from '../supabase_server_client.server';

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' as const;
const REFRESHED_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsImV4cCI6MTYxNjIzOTAyMiwiaWF0IjoxNjE2MjM1NDIyLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.MEucqaFh9nh9UJfBd1Z1aV3Z7tCn4R8dYc9HMRb3hAc' as const;
const REFRESH_TOKEN = 'Y3RmcG9zQmFzZTY0VGVzdFRva2VuS2V5XzEyMzQ1Njc4OV9xMjM0NXRnZg==' as const;
const SUPABASE_GET_USER_API_URL = `${process.env.SUPABASE_URL}/auth/v1/user` as const;
const SUPABASE_REFRESH_TOKEN_API_URL = `${process.env.SUPABASE_URL}/auth/v1/token` as const;

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('createSupabaseServerClient()', () => {
  test('an access token is available, return the Supabase client and current session', async () => {
    // Given
    const session = await getSession();
    session.set('accessToken', ACCESS_TOKEN);
    session.set('refreshToken', REFRESH_TOKEN);
    server.use(
      http.get(SUPABASE_GET_USER_API_URL, () => {
        return HttpResponse.json(UserFactory.build({ id: 'f67a4545-6c8b-456e-8569-263a2a5fd653' }));
      }),
    );

    // When
    const data = await createSupabaseServerClient(session);

    // Then
    expect(data).not.toEqual({ session: null, supabaseClient: null });
  });

  test('an access token is unavailable but a refresh token is available, return the Supabase client and currnet session', async () => {
    // Given
    const session = await getSession();
    session.set('accessToken', ACCESS_TOKEN);
    session.set('refreshToken', REFRESH_TOKEN);
    server.use(
      http.get(SUPABASE_GET_USER_API_URL, () => {
        return HttpResponse.json(new AuthError('Unauthorized', 401), { status: 401 });
      }),
      http.post(SUPABASE_REFRESH_TOKEN_API_URL, async () => {
        return HttpResponse.json(SessionFactory.build({ access_token: REFRESHED_ACCESS_TOKEN }));
      }),
    );

    // When
    const data = await createSupabaseServerClient(session);

    // Then
    expect(data).not.toEqual({ session: null, supabaseClient: null });
  });

  test('a session is not passed to an argument, return a new Supabase client', async () => {
    // When
    const { supabaseClient } = await createSupabaseServerClient();

    // Then
    expect(supabaseClient).not.toBe(null);
  });

  test('an access token is updated, the new access token is stored in a new session', async () => {
    // Given
    const session = await getSession();
    session.set('accessToken', ACCESS_TOKEN);
    session.set('refreshToken', REFRESH_TOKEN);
    server.use(
      http.get(SUPABASE_GET_USER_API_URL, () => {
        return HttpResponse.json(new AuthError('Unauthorized', 401), { status: 401 });
      }),
      http.post(SUPABASE_REFRESH_TOKEN_API_URL, async () => {
        return HttpResponse.json(SessionFactory.build({ access_token: REFRESHED_ACCESS_TOKEN }));
      }),
    );

    // When
    const { session: newSession } = await createSupabaseServerClient(session);

    // Then
    expect(newSession!.get('accessToken')).not.toBe(session.get('accessToken'));
  });
});
