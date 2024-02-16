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
  useNavigation,
} from '@remix-run/react';
import classNames from 'classnames';
import { useSetAtom } from 'jotai/react';

import Loading from './common_components/Loading';
import { createSupabaseServerClient } from './databases/supabase_server_client.server';
import { getSession } from './features/auth/cookie_session_storage.server';
import { microCmsClientConfigAtom } from './features/publish/atoms/micro_cms_client_config_atom';
import { fetchMicroCmsClientConfig } from './features/publish/micro_cms_client_config_fetcher';
import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const session = await getSession(request.headers.get('Cookie'));
  const supabaseClient = createSupabaseServerClient({ accessToken: session.get('accessToken'), request });

  const microCmsClientConfig = await fetchMicroCmsClientConfig({ request, supabaseClient });

  return json(
    {
      microCmsClientConfig,
    },
    { headers: response.headers },
  );
};

export default function App() {
  const { microCmsClientConfig } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const isSubmitting = state === 'submitting';

  const setMicroCmsClientConfig = useSetAtom(microCmsClientConfigAtom);

  if (microCmsClientConfig != null) {
    setMicroCmsClientConfig(microCmsClientConfig);
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
        <div
          className={classNames('absolute bg-opacity-80 bg-slate-100 flex h-full items-center justify-center w-full', {
            hidden: !isSubmitting,
          })}
        >
          <Loading />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
