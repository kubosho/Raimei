import { json } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { cmsContentsRepository } from '../cms/cms_contents_repository';
import { EntryData } from '../entities/entry_data';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';

export const loader = async () => {
  const repository = cmsContentsRepository();
  if (repository == null) {
    return json({
      contents: null,
      hasSession: false,
    });
  }

  const contents = await repository.fetch({});

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

function LoggedInIndex({ contents }: { contents: EntryData[] }): JSX.Element {
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
