import { Link } from '@remix-run/react';

import { ThunderSvg } from '../../assets/components/ThunderSvg';
import AccountMenu from '../../features/navigation/AccountMenu';

interface Props {
  hasSession: boolean;
  isHiddenAuthComponent: boolean;
}

export default function Header({ hasSession, isHiddenAuthComponent }: Props) {
  return (
    <header className="flex items-center justify-between max-w-screen-md mx-auto px-2 py-4 w-full">
      <h1 className="py-2">
        <Link className="flex items-center pr-1 text-gray-900" to={{ pathname: '/' }}>
          <ThunderSvg alt="" className="fill-yellow-500 h-4 w-4" />
          <span className="ml-1">Raimei</span>
        </Link>
      </h1>
      {isHiddenAuthComponent ? null : hasSession ? (
        <AccountMenu />
      ) : (
        <Link to={{ pathname: '/login' }} className="p-1">
          Login
        </Link>
      )}
    </header>
  );
}
