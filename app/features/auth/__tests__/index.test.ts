import { afterEach, describe, expect, it, vi } from 'vitest';

import { Auth } from '..';
import type { AuthClient } from '..';

const mockAuthClient: AuthClient = {
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
};

describe('Auth', () => {
  const auth = new Auth(mockAuthClient);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login()', () => {
    it('login() is executed once', () => {
      // Given
      const spy = vi.spyOn(auth, 'login');

      // When
      auth.login({ email: 'test@example.com', password: 'password' });

      // Then
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout()', () => {
    it('logout() is executed once', () => {
      // Given
      const spy = vi.spyOn(auth, 'logout');

      // When
      auth.logout();

      // Then
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('retriveSession()', () => {
    it('retriveSession() is executed once', () => {
      // Given
      const spy = vi.spyOn(auth, 'retriveSession');

      // When
      auth.retriveSession();

      // Then
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAuthStateChange()', () => {
    it('onAuthStateChange() is executed once', () => {
      // Given
      const spy = vi.spyOn(auth, 'onAuthStateChange');

      // When
      auth.onAuthStateChange(() => {});

      // Then
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
