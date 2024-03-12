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

function LoggedOutIndex(): JSX.Element {
  return (
    <>
      <Header useHeading={false} />
      <main className="flex items-center mx-2">
        <div className="bg-yellow-50 border border-yellow-500 flex items-center justify-between max-w-screen-md mx-auto rounded px-8 py-10 w-full">
          <h1 className="flex font-thin items-center text-4xl">Just Writing.</h1>
          <Link className="bg-yellow-500 px-4 py-2 rounded text-slate-900" to={{ pathname: '/login' }}>
            Login
          </Link>
        </div>
      </main>
    </>
  );
}

function LoggedInIndex({ contents }: { contents: MicroCmsApiSchema[] }): JSX.Element {
  return (
    <>
      <Header>
        <AccountMenu hasSession={true} />
      </Header>
      <main className="mt-4">
        <div className="max-w-screen-md mx-auto px-2">
          <Link className="bg-yellow-500  leading-relaxed px-4 py-2 rounded text-slate-900" to="/entries/new">
            Create new enrty
          </Link>
        </div>
        <ul className="max-w-screen-md mt-8 mx-auto px-2">
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

export default function Index(): JSX.Element {
  const { hasSession, microCmsData } = useLoaderData<typeof loader>();
  const contents = microCmsData?.contents ?? [];

  return hasSession ? <LoggedInIndex contents={contents} /> : <LoggedOutIndex />;
}
