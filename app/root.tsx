import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from '@remix-run/react';
import { useSetAtom } from 'jotai/react';

import { createSupabaseServerClient } from './databases/supabase_server_client.server';
import { getSession } from './features/auth/cookie_session_storage.server';
import { microCmsClientConfigAtom } from './features/publish/atoms/micro_cms_client_config_atom';
import { fetchMicroCmsConfig } from './features/publish/micro_cms_config_fetcher';
import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('accessToken');

  const supabaseClient = createSupabaseServerClient({ accessToken, request });
  const microCmsConfig = await fetchMicroCmsConfig({ request, supabaseClient });

  return json(
    {
      microCmsConfig,
    },
    { headers: response.headers },
  );
};

export default function App() {
  const { microCmsConfig } = useLoaderData<typeof loader>();

  const setMicroCmsClientConfig = useSetAtom(microCmsClientConfigAtom);

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
