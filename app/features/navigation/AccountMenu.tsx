import { Link } from '@remix-run/react';
import { useAtomValue } from 'jotai/react';

import { userSessionAtom } from '../auth/atoms/user_session_atom';

export default function AccountMenu() {
  const session = useAtomValue(userSessionAtom);

  if (session == null) {
    return <></>;
  }

  return (
    <ul className="flex">
      <li>
        <Link className="p-1" to={{ pathname: '/settings' }}>
          Settings
        </Link>
      </li>
      <li className="ml-8">
        <Link className="p-1" to={{ pathname: '/auth/logout' }}>
          Logout
        </Link>
      </li>
    </ul>
  );
}
