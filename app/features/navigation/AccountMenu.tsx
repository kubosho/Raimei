import { Link } from '@remix-run/react';

interface Props {
  hasSession: boolean;
}

export default function AccountMenu({ hasSession }: Props) {
  return hasSession ? (
    <ul className="flex">
      <li>
        <Link className="p-1" to={{ pathname: '/settings' }}>
          Settings
        </Link>
      </li>
      <li className="ml-8">
        <Link className="p-1" to={{ pathname: '/logout' }}>
          Logout
        </Link>
      </li>
    </ul>
  ) : (
    <Link to={{ pathname: '/login' }} className="p-1">
      Login
    </Link>
  );
}
