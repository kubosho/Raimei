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
    <button type="button" onClick={handleClick}>
      Logout
    </button>
  );
}
