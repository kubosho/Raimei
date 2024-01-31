import { useOutletContext } from '@remix-run/react';
import { useCallback } from 'react';
import type { MouseEvent } from 'react';

import type { Auth } from '..';

interface Props {
  onClick: () => void;
}

export default function LogoutButton({ onClick }: Props) {
  const { auth } = useOutletContext<{ auth: Auth }>();

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

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
