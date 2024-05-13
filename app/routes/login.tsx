import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';

import Header from '../features/navigation/Header';
import { authenticator } from '../features/auth/auth.server';

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
            <Form action="/login" method="post" className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none px-2 py-1 rounded-none"
                type="email"
                name="email"
                id="email"
                defaultValue=""
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="email"
                spellCheck={false}
              />
              <label className="mt-10" htmlFor="password">
                Password
              </label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none px-2 py-1 rounded-none"
                type="password"
                name="password"
                id="password"
                defaultValue=""
                autoComplete="current-password"
              />
              <button type="submit" className="bg-yellow-500 mt-10 px-4 py-2 rounded text-slate-900">
                Login
              </button>
            </Form>
          </div>
        </section>
      </main>
    </>
  );
}
