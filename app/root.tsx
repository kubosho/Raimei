import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from '@remix-run/react';
import { createBrowserClient } from '@supabase/ssr';
import { useSetAtom } from 'jotai/react';

import { Database } from '../types/database.types';

import { useInstance } from './common_hooks/use_instance';
import { supabaseClientAtom } from './databases/atom/supabase_client_atom';
import { createSupabaseServerClient } from './databases/supabase_server_client.server';
import { Auth } from './features/auth';
import { authAtom } from './features/auth/atoms/auth_atom';
import { getSession } from './features/auth/cookie_session_storage.server';
import { microCmsClientConfigAtom } from './features/publish/atoms/micro_cms_client_config_atom';
import { fetchMicroCmsConfig } from './features/publish/micro_cms_config_fetcher';
import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('accessToken');

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  if (accessToken == null) {
    return json(
      {
        env,
        microCmsConfig: null,
        session,
      },
      { headers: response.headers },
    );
  }

  const supabaseClient = createSupabaseServerClient({ accessToken, request });
  const microCmsConfig = await fetchMicroCmsConfig({ request, supabaseClient });

  return json(
    {
      env,
      microCmsConfig,
      session,
    },
    { headers: response.headers },
  );
};

export default function App() {
  const { env, microCmsConfig } = useLoaderData<typeof loader>();

  const supabase = useInstance(createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY));
  const auth = useInstance(new Auth(supabase.auth));

  const setAuthAtom = useSetAtom(authAtom);
  const setMicroCmsClientConfig = useSetAtom(microCmsClientConfigAtom);
  const setSupabaseClientAtom = useSetAtom(supabaseClientAtom);

  setAuthAtom(auth);
  setSupabaseClientAtom(supabase);

  if (microCmsConfig != null) {
    setMicroCmsClientConfig(microCmsConfig);
  }

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="gap-16 grid grid-flow-row grid-rows-[auto_1fr] min-h-dvh">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
