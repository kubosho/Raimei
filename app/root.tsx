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
import { useAtom, useSetAtom } from 'jotai/react';
import { useCallback } from 'react';

import Alert from './components/Alert';
import Loading from './components/Loading';
import { createSupabaseServerClient } from './database/supabase_server_client.server';
import { alertStateAtom } from './features/alert/atoms/alert_state_atom';
import { commitSession, getSession } from './features/auth/cookie_session_storage.server';
import { microCmsClientConfigAtom } from './features/publish/atoms/micro_cms_client_config_atom';
import { fetchMicroCmsClientConfig } from './features/publish/micro_cms_client_config_fetcher.server';
import { initializeMicroCmsConfigCacheInstance } from './local_storage/micro_cms_config_cache.server';
import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  {
    // Initialize cache
    initializeMicroCmsConfigCacheInstance();
  }

  const currentSession = await getSession(request.headers.get('Cookie'));
  const { session, supabaseClient } = await createSupabaseServerClient(currentSession);
  const userId = session?.get('userId');
  if (session == null || supabaseClient == null || userId == null) {
    return json({ microCmsClientConfig: null });
  }

  const microCmsClientConfig = await fetchMicroCmsClientConfig({ supabaseClient, userId });

  const responseInit: ResponseInit = {};
  if (currentSession.get('accessToken') !== session.get('accessToken')) {
    responseInit.headers = {
      ['Set-Cookie']: await commitSession(session),
    };
  }

  return json({ microCmsClientConfig }, responseInit);
};

export default function App() {
  const { microCmsClientConfig } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const isSubmitting = state === 'submitting';

  const [alertState, setAlertState] = useAtom(alertStateAtom);

  const setMicroCmsClientConfig = useSetAtom(microCmsClientConfigAtom);

  const handleClickCloseAlert = useCallback(() => {
    setAlertState(null);
  }, [setAlertState]);

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
      <body className="min-h-dvh">
        <Outlet />
        {alertState == null ? null : (
          <div className="absolute inline-flex inset-x-0 justify-center top-4">
            <Alert
              description={alertState.description}
              message={alertState.message}
              type={alertState.type}
              onClose={handleClickCloseAlert}
            />
          </div>
        )}
        <div
          className={classNames(
            'absolute bg-opacity-80 bg-slate-100 flex h-full items-center justify-center left-0 top-0 w-full',
            {
              hidden: !isSubmitting,
            },
          )}
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
