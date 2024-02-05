import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useAtomValue } from 'jotai/react';
import { useCallback } from 'react';

import LoginButton from '../features/auth/components/LoginButton';
import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import TextEditor from '../features/editor/components/TextEditor';
import TitleEditor from '../features/editor/components/TitleEditor';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Index() {
  const navigate = useNavigate();

  const session = useAtomValue(userSessionAtom);

  const handleClickLoginButton = useCallback(() => {
    navigate({ pathname: '/auth/login' });
  }, [navigate]);

  return (
    <>
      <Header>{session == null ? <LoginButton onClick={handleClickLoginButton} /> : <AccountMenu />}</Header>
      <main>
        <div className="max-w-screen-md mx-auto">
          <TitleEditor />
        </div>
        <div className="max-w-screen-md mt-10 mx-auto">
          <TextEditor />
        </div>
      </main>
    </>
  );
}
