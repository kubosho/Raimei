import { json } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, redirect, useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';

import { createSupabaseServerClient } from '../databases/supabase_server_client.server';
import { commitSession, getSession } from '../features/auth/cookie_session_storage.server';
import Header from '../features/navigation/Header';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  return json({
    userId: session.get('userId'),
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabaseClient = createSupabaseServerClient({ request });

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error != null) {
    session.flash('error', error);

    // Redirect back to the login page with errors.
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  session.set('accessToken', data.session.access_token);
  session.set('userId', data.user.id);

  // Login succeeded, send them to the home page.
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export const meta: MetaFunction = () => {
  return [{ title: 'Login — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Login() {
  const { userId } = useLoaderData<typeof loader>();
  const hasSession = userId != null;

  return (
    <>
      <Header hasSession={hasSession} isHiddenAuthComponent={true} />
      <main>
        <section className="max-w-screen-md mx-auto px-2">
          <h2 className="leading-relaxed text-3xl">Login</h2>
          <div className="mt-10">
            <Form action="/login" method="post" className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
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
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="password"
                name="password"
                id="password"
                defaultValue=""
                autoComplete="current-password"
              />
              <button type="submit" className="border-2 border-yellow-500 mt-10 px-4 py-1 rounded text-slate-900">
                Login
              </button>
            </Form>
          </div>
        </section>
      </main>
    </>
  );
}
