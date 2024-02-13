import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useAtom, useAtomValue } from 'jotai/react';
import type { FormEvent } from 'react';

import { supabaseClientAtom } from '../databases/atom/supabase_client_atom';
import { getSession } from '../features/auth/cookie_session_storage.server';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { microCmsClientConfigAtom } from '../features/publish/atoms/micro_cms_client_config_atom';
import LoginButtonLink from '../features/auth/components/LoginButtonLink';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  return json({
    hasSession: session.has('userId'),
    userId: session.get('userId'),
  });
};

export default function SettingsMicroCms(): JSX.Element {
  const { hasSession, userId } = useLoaderData<typeof loader>();

  const [microCmsClientConfig, setMicroCmsClientConfig] = useAtom(microCmsClientConfigAtom);

  const supabaseClient = useAtomValue(supabaseClientAtom);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!hasSession || userId == null || supabaseClient == null) {
      return;
    }

    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const apiKey = formData.get('apiKey') as string;
    const endpoint = formData.get('endpoint') as string;
    const serviceId = formData.get('serviceId') as string;

    const config = { apiKey, endpoint, serviceId, userId };
    setMicroCmsClientConfig(config);

    await supabaseClient
      .from('micro_cms_configs')
      .upsert({ api_key: apiKey, endpoint, service_id: serviceId, supabase_user_id: userId })
      .select();
  };

  return (
    <>
      <Header>{hasSession ? <AccountMenu /> : <LoginButtonLink />}</Header>
      <main>
        <section className="max-w-screen-md mx-auto px-2">
          <h2 className="leading-relaxed text-3xl">Settings</h2>
          {!hasSession ? (
            <p>Please log in to view settings.</p>
          ) : (
            <form className="flex flex-col mt-10" onSubmit={handleFormSubmit}>
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
            </form>
          )}
        </section>
      </main>
    </>
  );
}
