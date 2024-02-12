import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react';
import { createBrowserClient, createServerClient, parse, serialize } from '@supabase/ssr';
import { useSetAtom } from 'jotai/react';
import { useEffect } from 'react';

import { Database } from '../types/database.types';

import { useInstance } from './common_hooks/use_instance';
import { supabaseClientAtom } from './databases/atom/supabase_client_atom';
import { Auth } from './features/auth';
import { authAtom } from './features/auth/atoms/auth_atom';
import { userSessionAtom } from './features/auth/atoms/user_session_atom';
import { microCmsClientConfigAtom } from './features/publish/atoms/micro_cms_client_config_atom';
import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };
  const response = new Response();
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabaseClient = createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });
  const auth = new Auth(supabaseClient.auth);

  const { data } = await supabaseClient.from('micro_cms_configs').select();
  const {
    data: { session },
  } = await auth.retriveSession();

  const microCmsConfig = data
    ?.filter((d) => d.supabase_user_id === session?.user.id)
    .map((d) => {
      return {
        apiKey: d.api_key ?? '',
        endpoint: d.endpoint ?? '',
        serviceId: d.service_id ?? '',
      };
    })
    .at(0);

  return json(
    {
      env,
      microCmsConfig,
      session,
    },
    {
      headers: response.headers,
    },
  );
};

export default function App() {
  const { env, microCmsConfig, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const supabase = useInstance(createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY));
  const auth = useInstance(new Auth(supabase.auth));

  const setAuthAtom = useSetAtom(authAtom);
  const setMicroCmsClientConfig = useSetAtom(microCmsClientConfigAtom);
  const setSupabaseClientAtom = useSetAtom(supabaseClientAtom);
  const setUserSessionAtom = useSetAtom(userSessionAtom);

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION' && session?.access_token !== serverAccessToken) {
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth, revalidate, serverAccessToken]);

  setAuthAtom(auth);
  setSupabaseClientAtom(supabase);

  if (microCmsConfig != null) {
    setMicroCmsClientConfig(microCmsConfig);
  }

  if (session != null) {
    setUserSessionAtom(session);
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
