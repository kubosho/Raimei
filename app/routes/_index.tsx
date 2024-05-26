import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { authenticator } from '../features/auth/auth.server';
import Header from '../features/navigation/Header';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData != null) {
    return redirect('/entries/new');
  }

  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

function LoggedOutIndex(): JSX.Element {
  return (
    <>
      <Header useHeading={false} />
      <main className="flex items-center mx-2">
        <div className="bg-yellow-50 border border-yellow-500 flex items-center justify-between max-w-screen-md mt-8 mx-auto rounded px-8 py-10 w-full">
          <h1 className="font-thin text-4xl">Just Writing.</h1>
          <Link className="bg-yellow-500 px-4 py-2 rounded text-slate-900" to={{ pathname: '/login' }}>
            Login
          </Link>
        </div>
      </main>
    </>
  );
}

export default function Index(): JSX.Element {
  return <LoggedOutIndex />;
}
