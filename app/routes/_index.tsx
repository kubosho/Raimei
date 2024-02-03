import type { MetaFunction } from '@remix-run/node';
import { useAtomValue } from 'jotai/react';

import { ThunderSvg } from '../assets/components/ThunderSvg';
import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
import LoginForm from '../features/auth/components/LoginForm';
import LogoutButton from '../features/auth/components/LogoutButton';
import TextEditor from '../features/editor/components/TextEditor';
import TitleEditor from '../features/editor/components/TitleEditor';

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Index() {
  const session = useAtomValue(userSessionAtom);

  return (
    <>
      <h1 className="items-center flex max-w-screen-md mx-auto text-gray-900">
        <ThunderSvg alt="" className="fill-yellow-500 h-4 w-4" />
        <span className="ml-1">Raimei</span>
      </h1>
      <main>
        <div className="max-w-screen-md mx-auto">
          <TitleEditor />
        </div>
        <div className="max-w-screen-md mt-10 mx-auto">
          <TextEditor />
        </div>
        {session == null ? <LoginForm onSubmit={() => {}} /> : <></>}
        {session != null ? <LogoutButton onClick={() => {}} /> : <></>}
      </main>
    </>
  );
}
