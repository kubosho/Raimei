import { Link } from '@remix-run/react';

export default function LoginButtonLink() {
  return (
    <Link to={{ pathname: '/login' }} className="border-2 border-yellow-500 px-4 py-1 rounded text-slate-900">
      Login
    </Link>
  );
}
