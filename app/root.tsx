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

import Alert from './common_components/Alert';
import Loading from './common_components/Loading';
import { createSupabaseServerClient } from './databases/supabase_server_client.server';
import { alertStateAtom } from './features/alert/atoms/alert_state_atom';
import { commitSession, getSession } from './features/auth/cookie_session_storage.server';
import { microCmsClientConfigAtom } from './features/publish/atoms/micro_cms_client_config_atom';
import { initializeMicroCmsConfigCacheStorage } from './storage/micro_cms_config_cache_storage';
import { fetchMicroCmsClientConfig } from './features/publish/micro_cms_client_config_fetcher';
import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentSession = await getSession(request.headers.get('Cookie'));
  const responseInit: ResponseInit = {};

  {
    // Initialize TTL cache.
    initializeMicroCmsConfigCacheStorage();
  }

  const { session, supabaseClient } = await createSupabaseServerClient(currentSession);
  if (supabaseClient == null || session == null) {
    return json({ microCmsClientConfig: null });
  }

  const userId = session.get('userId');
  const microCmsClientConfig = userId == null ? null : await fetchMicroCmsClientConfig({ supabaseClient, userId });

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
      <body className="gap-16 grid grid-flow-row grid-rows-[auto_1fr] min-h-dvh">
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
