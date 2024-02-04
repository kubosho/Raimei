import { useNavigate } from '@remix-run/react';
import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { useSetAtom } from 'jotai/react';
import { useCallback } from 'react';

import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import LoginForm from '../features/auth/components/LoginForm';

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
    <div className="max-w-screen-md mx-auto">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
}
