import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { createClient } from 'microcms-js-sdk';

import type { MicroCmsApiSchema } from '../../types/micro_cms_api_schema.types';
import { createSupabaseServerClient } from '../database/supabase_server_client.server';
import { getSession } from '../features/auth/cookie_session_storage.server';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { fetchMicroCmsClientConfig } from '../features/publish/micro_cms_client_config_fetcher.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentSession = await getSession(request.headers.get('Cookie'));
  const { session, supabaseClient } = await createSupabaseServerClient(currentSession);
  const userId = session?.get('userId');
  if (supabaseClient == null || session == null || userId == null) {
    return json({ hasSession: false, microCmsData: null });
  }

  const config = await fetchMicroCmsClientConfig({ supabaseClient, userId });
  if (config == null || config.apiKey === '' || config.serviceId === '') {
    return json({ hasSession: true, microCmsData: null });
  }

  const client = createClient({
    apiKey: config.apiKey,
    serviceDomain: config.serviceId,
  });
  const microCmsData = await client.getList<MicroCmsApiSchema>({ endpoint: config.endpoint });

  return json({
    hasSession: true,
    microCmsData,
  });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Index() {
  const { hasSession, microCmsData } = useLoaderData<typeof loader>();
  const contents = microCmsData?.contents ?? [];

  return (
    <>
      <Header>
        <AccountMenu hasSession={hasSession} />
      </Header>
      <main className="pb-16">
        <ul className="max-w-screen-md mx-auto px-2">
          <li>
            <Link to="/entries/new">Create new enrty</Link>
          </li>
          {contents.map(({ id, title }) => (
            <li key={id} className="my-4">
              <Link to={`/entries/${id}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
