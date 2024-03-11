import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, redirect } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';

import { createSupabaseServerClient } from '../database/supabase_server_client.server';
import { commitSession, getSession } from '../features/auth/cookie_session_storage.server';
import Header from '../features/navigation/Header';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { supabaseClient } = await createSupabaseServerClient();
  if (supabaseClient == null) {
    return redirect('/login');
  }

  const session = await getSession(request.headers.get('Cookie'));
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error != null) {
    session.flash('error', error);

    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  session.set('accessToken', data.session.access_token);
  session.set('refreshToken', data.session.refresh_token);
  session.set('userId', data.user.id);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Login — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Login() {
  return (
    <>
      <Header />
      <main className="flex items-center">
        <section className="max-w-screen-md mx-auto px-2 w-full">
          <h2 className="leading-relaxed text-3xl">Login</h2>
          <div className="bg-yellow-50 border border-yellow-500 max-w-screen-md mt-8 mx-auto rounded px-8 py-10">
            <Form action="/login" method="post" className="flex flex-col w-full">
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
              <button
                type="submit"
                className="bg-yellow-500 border-2 border-yellow-500 mt-10 px-4 py-1 rounded text-slate-900"
              >
                Login
              </button>
            </Form>
          </div>
        </section>
      </main>
    </>
  );
}
