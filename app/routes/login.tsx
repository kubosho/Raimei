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
        <section className="max-w-screen-md mx-auto px-2">
          <h1 className="leading-relaxed text-3xl">Login</h1>
          <div className="bg-yellow-50 border border-yellow-500 max-w-screen-md mt-8 mx-auto rounded px-8 py-10">
            <LoginForm action="/login" />
          </div>
        </section>
      </main>
    </>
  );
}
