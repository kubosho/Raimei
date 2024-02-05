import { useAtomValue } from 'jotai/react';
import { useCallback } from 'react';
import type { MouseEvent } from 'react';

import { authAtom } from '../atoms/auth_atom';

interface Props {
  onClick: () => void;
}

export default function LogoutButton({ onClick }: Props) {
  const auth = useAtomValue(authAtom);

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (auth == null) {
        throw new Error('Auth is not initialized. Please reload the page.');
      }

      await auth.logout();

      onClick();
    },
    [auth, onClick],
  );

  return (
    <button className="border-2 border-yellow-500 px-4 py-1 rounded text-slate-900" type="button" onClick={handleClick}>
      Logout
    </button>
  );
}
