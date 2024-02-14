import { Link } from '@remix-run/react';

export default function AccountMenu() {
  return (
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
  );
}
