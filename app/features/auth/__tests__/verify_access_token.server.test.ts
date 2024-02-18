import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { createSupabaseServerClient } from '../../../databases/supabase_server_client.server';
import { verifyAccessToken } from '../verify_access_token.server';
import { UserFactory } from '../__mock__/user_factory';
import { AuthErrorFactory } from '../__mock__/auth_error_factory';

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

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' as const;
const SUPABASE_URL = `${process.env.SUPABASE_URL}/auth/v1/user` as const;

describe('verifyAccessToken()', () => {
  test('an access token pass to an argument is valid, the access token is returned as is', async () => {
    // Given
    server.use(
      http.get(SUPABASE_URL, () => {
        return HttpResponse.json(UserFactory.build({ id: 'f67a4545-6c8b-456e-8569-263a2a5fd653' }));
      }),
    );

    // When
    const supabaseClient = createSupabaseServerClient({ accessToken: ACCESS_TOKEN });

    // Then
    expect(await verifyAccessToken({ accessToken: ACCESS_TOKEN, supabaseClient })).toBe(ACCESS_TOKEN);
  });

  test('an access token pass to an argument is invalid, null is returned', async () => {
    // Given
    server.use(
      http.get(SUPABASE_URL, () => {
        return HttpResponse.json(AuthErrorFactory.build(), { status: 401 });
      }),
    );

    // When
    const supabaseClient = createSupabaseServerClient({ accessToken: ACCESS_TOKEN });

    // Then
    expect(await verifyAccessToken({ accessToken: ACCESS_TOKEN, supabaseClient })).toBe(null);
  });
});
