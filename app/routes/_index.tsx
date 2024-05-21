import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { getCmsApiUrl } from '../external_services/cms/cms_api_url';
import { createCmsContentsRepository } from '../external_services/cms/cms_contents_repository';
import { createSupabaseServerClient } from '../external_services/database/supabase_server_client.server';
import type { Entry } from '../external_services/cms/entities/entry';
import { authenticator } from '../features/auth/auth.server';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { fetchMicroCmsClientConfig } from '../features/publish/micro_cms_client_config_fetcher.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return json({
      contents: null,
      hasSession: false,
    });
  }

  const supabaseClient = createSupabaseServerClient({ session: userData.session });
  const microCmsConfig = await fetchMicroCmsClientConfig({ supabaseClient, userId: userData.user.id });
  if (microCmsConfig == null) {
    return json({
      contents: null,
      hasSession: true,
    });
  }

  const repository = createCmsContentsRepository({
    apiKey: microCmsConfig.apiKey,
    apiUrl: getCmsApiUrl({
      endpoint: microCmsConfig.endpoint,
      serviceId: microCmsConfig.serviceId,
    }),
  });
  const contents = await repository.get({});

  return json({
    contents,
    hasSession: true,
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

function LoggedInIndex({ contents }: { contents: Entry[] }): JSX.Element {
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
  const { contents, hasSession } = useLoaderData<typeof loader>();

  return hasSession ? <LoggedInIndex contents={contents?.contents ?? []} /> : <LoggedOutIndex />;
}
