import { useOutletContext } from '@remix-run/react';
import { useCallback } from 'react';
import type { FormEvent } from 'react';

import type { Auth } from '..';

interface Props {
  onSubmit: () => void;
}

export default function LoginForm({ onSubmit }: Props) {
  const { auth } = useOutletContext<{ auth: Auth }>();

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      await auth.login({
        email,
        password,
      });

      onSubmit();
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
