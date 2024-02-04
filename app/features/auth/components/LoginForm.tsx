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
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        defaultValue=""
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="email"
        spellCheck={false}
      />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" defaultValue="" autoComplete="current-password" />
      <button type="submit">Login</button>
    </form>
  );
}
