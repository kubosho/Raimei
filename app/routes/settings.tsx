import { json } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { useEffect } from 'react';

import { createSupabaseServerClient } from '../databases/supabase_server_client.server';
import { alertStateAtom } from '../features/alert/atoms/alert_state_atom';
import { getSession } from '../features/auth/cookie_session_storage.server';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { microCmsClientConfigAtom } from '../features/publish/atoms/micro_cms_client_config_atom';
import { destructMicroCmsConfigCacheStorage } from '../storage/micro_cms_config_cache_storage';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const userId = session.get('userId');

  return json({
    userId,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const currentSession = await getSession(request.headers.get('Cookie'));
  const accessToken = currentSession.get('accessToken') ?? null;
  const userId = currentSession.get('userId');

  if (accessToken == null || userId == null) {
    return json({
      data: null,
      error: {
        message: 'Unauthorized',
        status: 401,
      },
    });
  }

  const { supabaseClient } = await createSupabaseServerClient(currentSession);
  if (supabaseClient == null) {
    // TODO: Offline error handling
    return json({
      data: null,
      error: null,
    });
  }

  const formData = await request.formData();
  const apiKey = formData.get('apiKey') as string;
  const endpoint = formData.get('endpoint') as string;
  const serviceId = formData.get('serviceId') as string;

  const { data, error } = await supabaseClient
    .from('micro_cms_configs')
    .upsert({ api_key: apiKey, endpoint, service_id: serviceId, supabase_user_id: userId })
    .select();

  destructMicroCmsConfigCacheStorage();

  return json({ data, error });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Settings — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function SettingsMicroCms(): JSX.Element {
  const actionData = useActionData<typeof action>();
  const { userId } = useLoaderData<typeof loader>();
  const hasSession = userId != null;

  const microCmsClientConfig = useAtomValue(microCmsClientConfigAtom);

  const setAlertState = useSetAtom(alertStateAtom);

  useEffect(() => {
    if (actionData == null) {
      return;
    }

    const { error } = actionData;
    if (error != null) {
      setAlertState({
        type: 'error',
        message: error.message,
      });
      return;
    }

    setAlertState({
      type: 'success',
      message: 'Settings saved',
    });
  }, [actionData, setAlertState]);

  return (
    <>
      <Header>
        <AccountMenu hasSession={hasSession} />
      </Header>
      <main>
        <section className="max-w-screen-md mx-auto px-2">
          <h2 className="leading-relaxed text-3xl">Settings</h2>
          {!hasSession ? (
            <p>Please log in to view settings.</p>
          ) : (
            <Form action="/settings" method="post" className="flex flex-col mt-10">
              <label htmlFor="serviceId">microCMS service ID</label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="text"
                name="serviceId"
                id="serviceId"
                defaultValue={microCmsClientConfig?.serviceId}
                autoCapitalize="none"
              />
              <label className="mt-10" htmlFor="endpoint">
                microCMS API Endpoint
              </label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="text"
                name="endpoint"
                id="endpoint"
                defaultValue={microCmsClientConfig?.endpoint}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <label className="mt-10" htmlFor="apiKey">
                microCMS API key
              </label>
              <input
                className="border-b-2 border-slate-500 focus:outline-none py-1"
                type="text"
                name="apiKey"
                id="apiKey"
                defaultValue={microCmsClientConfig?.apiKey}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <button type="submit" className="border-2 border-yellow-500 mt-10 px-4 py-1 rounded text-slate-900">
                Submit
              </button>
            </Form>
          )}
        </section>
      </main>
    </>
  );
}
