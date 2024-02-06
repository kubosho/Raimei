import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';
import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { useSetAtom } from 'jotai/react';
import { useCallback } from 'react';

import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import LoginForm from '../features/auth/components/LoginForm';

export const meta: MetaFunction = () => {
  return [{ title: 'Login — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Login() {
  const navigate = useNavigate();

  const setSession = useSetAtom(userSessionAtom);

  const onSubmit = useCallback(
    async ({ data, error }: AuthTokenResponsePassword) => {
      if (error != null) {
        return;
      }

      setSession(data.session);

      navigate({ pathname: '/' });
    },
    [navigate, setSession],
  );

  return (
    <section className="max-w-screen-md mt-16 mx-auto">
      <h2 className="leading-relaxed text-3xl">Login</h2>
      <div className="mt-10">
        <LoginForm onSubmit={onSubmit} />
      </div>
    </section>
  );
}
