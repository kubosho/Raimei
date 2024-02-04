import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useAtomValue } from 'jotai/react';
import { useCallback } from 'react';

import { ThunderSvg } from '../assets/components/ThunderSvg';
import LoginButton from '../features/auth/components/LoginButton';
import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import TextEditor from '../features/editor/components/TextEditor';
import TitleEditor from '../features/editor/components/TitleEditor';
import AccountMenu from '../features/navigation/AccountMenu';

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
      <header className="flex justify-between max-w-screen-md mx-auto">
        <h1 className="items-center flex text-gray-900">
          <ThunderSvg alt="" className="fill-yellow-500 h-4 w-4" />
          <span className="ml-1">Raimei</span>
        </h1>
        {session == null ? <LoginButton onClick={handleClickLoginButton} /> : <AccountMenu />}
      </header>
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
