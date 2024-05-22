import { json, redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';
import { useSetAtom } from 'jotai/react';
import { useEffect } from 'react';

import { createSupabaseServerClient } from '../external_services/database/supabase_server_client.server';
import { alertStateAtom } from '../features/alert/atoms/alert_state_atom';
import { authenticator } from '../features/auth/auth.server';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { fetchMicroCmsClientConfig } from '../features/publish/micro_cms_client_config_fetcher.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return redirect('/login');
  }

  const supabaseClient = createSupabaseServerClient({ session: userData.session });

  const microCmsConfig = await fetchMicroCmsClientConfig({ supabaseClient, userId: userData.user.id });

  return json({
    hasSession: true,
    microCmsConfig,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return json({
      data: null,
      error: {
        message: 'Unauthorized',
        status: 401,
      },
    });
  }

  const supabaseClient = createSupabaseServerClient({ session: userData.session });
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
    .upsert({ api_key: apiKey, endpoint, service_id: serviceId, supabase_user_id: userData.user.id })
    .select();

  return json({
    data,
    error,
  });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Settings — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function SettingsMicroCms(): JSX.Element {
  const actionData = useActionData<typeof action>();
  const { hasSession, microCmsConfig } = useLoaderData<typeof loader>();

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
          <Form
            action="/settings"
            method="post"
            className="bg-yellow-50 border border-yellow-500 flex flex-col max-w-screen-md mt-8 mx-auto rounded px-8 py-10"
          >
            <label htmlFor="serviceId">microCMS service ID</label>
            <input
              className="border-b-2 border-slate-500 focus:outline-none px-2 py-1 rounded-none"
              type="text"
              name="serviceId"
              id="serviceId"
              defaultValue={microCmsConfig?.serviceId}
              autoCapitalize="none"
            />
            <label className="mt-10" htmlFor="endpoint">
              microCMS API Endpoint
            </label>
            <input
              className="border-b-2 border-slate-500 focus:outline-none px-2 py-1 rounded-none"
              type="text"
              name="endpoint"
              id="endpoint"
              defaultValue={microCmsConfig?.endpoint}
              autoCapitalize="none"
              autoCorrect="off"
            />
            <label className="mt-10" htmlFor="apiKey">
              microCMS API key
            </label>
            <input
              className="border-b-2 border-slate-500 focus:outline-none px-2 py-1 rounded-none"
              type="text"
              name="apiKey"
              id="apiKey"
              defaultValue={microCmsConfig?.apiKey}
              autoCapitalize="none"
              autoCorrect="off"
            />
            <button type="submit" className="bg-yellow-500 mt-10 px-4 py-2 rounded text-slate-900">
              Submit
            </button>
          </Form>
        </section>
      </main>
    </>
  );
}
