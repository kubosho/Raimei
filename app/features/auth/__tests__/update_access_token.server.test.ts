import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { createSupabaseServerClient } from '../../../databases/supabase_server_client.server';
import { AuthErrorFactory } from '../__mock__/auth_error_factory';
import { updateAccessToken } from '../update_access_token.server';
import { SessionFactory } from '../__mock__/session_factory';

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

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' as const;
const REFRESHED_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsImV4cCI6MTYxNjIzOTAyMiwiaWF0IjoxNjE2MjM1NDIyLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.MEucqaFh9nh9UJfBd1Z1aV3Z7tCn4R8dYc9HMRb3hAc' as const;
const REFRESH_TOKEN = 'Y3RmcG9zQmFzZTY0VGVzdFRva2VuS2V5XzEyMzQ1Njc4OV9xMjM0NXRnZg==' as const;
const SUPABASE_URL = `${process.env.SUPABASE_URL}/auth/v1/token` as const;

describe('updateAccessToken()', () => {
  test('a refresh token is available, a new access token is returned', async () => {
    // Given
    server.use(
      http.post(SUPABASE_URL, () => {
        return HttpResponse.json(SessionFactory.build({ access_token: REFRESHED_ACCESS_TOKEN }));
      }),
    );

    // When
    const supabaseClient = createSupabaseServerClient({ accessToken: ACCESS_TOKEN });

    // Then
    expect(await updateAccessToken({ refreshToken: REFRESH_TOKEN, supabaseClient })).toBe(REFRESHED_ACCESS_TOKEN);
  });

  test('a refresh token is unavailable, null is returned', async () => {
    // Given
    server.use(
      http.post(SUPABASE_URL, () => {
        return HttpResponse.json(AuthErrorFactory.build(), { status: 401 });
      }),
    );

    // When
    const supabaseClient = createSupabaseServerClient({ accessToken: ACCESS_TOKEN });

    // Then
    expect(await updateAccessToken({ refreshToken: REFRESH_TOKEN, supabaseClient })).toBe(null);
  });
});
