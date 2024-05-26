import { Theme } from '@radix-ui/themes';
import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useNavigation } from '@remix-run/react';
import classNames from 'classnames';
import { useAtom } from 'jotai/react';
import { useCallback } from 'react';

import Alert from './components/Alert';
import Loading from './components/Loading';
import { alertStateAtom } from './features/alert/atoms/alert_state_atom';

import radixUIStyleSheet from '@radix-ui/themes/styles.css';
import tailwindStyleSheet from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: radixUIStyleSheet },
  { rel: 'stylesheet', href: tailwindStyleSheet },
];

export default function App() {
  const { state } = useNavigation();
  const isSubmitting = state === 'submitting';

  const [alertState, setAlertState] = useAtom(alertStateAtom);

  const handleClickCloseAlert = useCallback(() => {
    setAlertState(null);
  }, [setAlertState]);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme>
          <div className="min-h-dvh">
            <Outlet />
          </div>
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
        </Theme>
      </body>
    </html>
  );
}
