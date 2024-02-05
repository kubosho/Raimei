import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { useAtomValue } from 'jotai/react';
import { useCallback } from 'react';
import type { FormEvent } from 'react';

import { authAtom } from '../atoms/auth_atom';

interface Props {
  onSubmit: (response: AuthTokenResponsePassword) => void;
}

export default function LoginForm({ onSubmit }: Props) {
  const auth = useAtomValue(authAtom);

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (auth == null) {
        throw new Error('Auth is not initialized. Please reload the page.');
      }

      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const authTokenResponse = await auth.login({
        email,
        password,
      });

      onSubmit(authTokenResponse);
    },
    [auth, onSubmit],
  );

  return (
    <form className="flex flex-col" onSubmit={handleFormSubmit}>
      <label htmlFor="email">Email</label>
      <input
        className="border-b-2 border-slate-500 focus:outline-none py-1"
        type="email"
        name="email"
        id="email"
        defaultValue=""
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="email"
        spellCheck={false}
      />
      <label className="mt-10" htmlFor="password">
        Password
      </label>
      <input
        className="border-b-2 border-slate-500 focus:outline-none py-1"
        type="password"
        name="password"
        id="password"
        defaultValue=""
        autoComplete="current-password"
      />
      <button type="submit" className="border-2 border-yellow-500 mt-10 px-4 py-1 rounded text-slate-900">
        Login
      </button>
    </form>
  );
}
