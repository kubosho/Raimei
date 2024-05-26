import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/react';

import { authenticator } from '../features/auth/auth.server';
import LoginForm from '../features/auth/components/LoginForm';
import Header from '../features/navigation/Header';

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('form', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
}

export const meta: MetaFunction = () => {
  return [{ title: 'Login — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Login() {
  return (
    <>
      <Header useHeading={false} />
      <main>
        <section className="bg-yellow-50 border border-yellow-500 max-w-screen-md mt-8 mx-auto rounded px-8 py-10">
          <h1 className="font-thin text-4xl">Login</h1>
          <div className="mt-8">
            <LoginForm action="/login" />
          </div>
        </section>
      </main>
    </>
  );
}
