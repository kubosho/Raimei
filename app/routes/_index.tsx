import type { MetaFunction } from '@remix-run/node';
import { useAtomValue } from 'jotai/react';

import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import LoginForm from '../features/auth/components/LoginForm';
import LogoutButton from '../features/auth/components/LogoutButton';

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Index() {
  const session = useAtomValue(userSessionAtom);

  return (
    <div>
      <h1>Raimei</h1>
      {session == null ? <LoginForm onSubmit={() => {}} /> : <></>}
      {session != null ? <LogoutButton onClick={() => {}} /> : <></>}
    </div>
  );
}
