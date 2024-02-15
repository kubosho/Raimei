import { json } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';

import { createSupabaseServerClient } from '../databases/supabase_server_client.server';
import { getSession } from '../features/auth/cookie_session_storage.server';
import Header from '../features/navigation/Header';
import { fetchMicroCmsConfig } from '../features/publish/micro_cms_config_fetcher';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  const accessToken = session.get('accessToken');

  const supabaseClient = createSupabaseServerClient({ accessToken, request });

  const microCmsClientConfig = await fetchMicroCmsConfig({ request, supabaseClient });

  return json({
    microCmsClientConfig,
    userId,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('accessToken') ?? null;
  const userId = session.get('userId');

  if (accessToken == null || userId == null) {
    return null;
  }

  const supabaseClient = createSupabaseServerClient({ accessToken, request });

  const formData = await request.formData();
  const apiKey = formData.get('apiKey') as string;
  const endpoint = formData.get('endpoint') as string;
  const serviceId = formData.get('serviceId') as string;

  await supabaseClient
    .from('micro_cms_configs')
    .upsert({ api_key: apiKey, endpoint, service_id: serviceId, supabase_user_id: userId })
    .select();

  return null;
}

export const meta: MetaFunction = () => {
  return [{ title: 'Settings — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function SettingsMicroCms(): JSX.Element {
  const { microCmsClientConfig, userId } = useLoaderData<typeof loader>();
  const hasSession = userId != null;

  return (
    <>
      <Header hasSession={hasSession} isHiddenAuthComponent={false} />
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
