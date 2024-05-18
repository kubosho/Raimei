import type { KvsEnvStorage } from '@kvs/env/lib/share';
import { json } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useAtom } from 'jotai/react';
import { useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { getCmsApiUrl } from '../external/cms/cms_api_url';
import { createCmsContentsRepository } from '../external/cms/cms_contents_repository';
import Loading from '../components/Loading';
import { createSupabaseServerClient } from '../external/database/supabase_server_client.server';
import { authenticator } from '../features/auth/auth.server';
import { bodyValueAtom } from '../features/editor/atoms/body_value_atom';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import Editor from '../features/editor/components/Editor';
import SubmitButton from '../features/editor/components/SubmitButton';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { fetchMicroCmsClientConfig } from '../features/publish/micro_cms_client_config_fetcher.server';
import { getEditorStorageInstance, initializeEditorStorageInstance } from '../local_storage/editor_storage.client';
import type { EditorStorageSchema } from '../local_storage/editor_storage_schema.client';

export const action = async ({ request }: ActionFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return null;
  }

  const supabaseClient = createSupabaseServerClient({ session: userData.session });

  const microCmsConfig = await fetchMicroCmsClientConfig({ supabaseClient, userId: userData.user.id });
  if (microCmsConfig == null) {
    return null;
  }

  const repository = createCmsContentsRepository({
    apiKey: microCmsConfig.apiKey,
    apiUrl: getCmsApiUrl({
      endpoint: microCmsConfig.endpoint,
      serviceId: microCmsConfig.serviceId,
    }),
  });

  const body = await request.formData();
  const title = body.get('title') as string;
  const contents = body.get('contents') as string;
  const slug = body.get('slug') as string;

  const res = await repository.create(
    {
      title,
      body: contents,
      slug,
    },
    {},
  );

  return res;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  return json({
    hasSession: userData != null,
  });
};

export const meta: MetaFunction = () => {
  return [{ title: 'New entry — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function EntryNew() {
  const fetcher = useFetcher();
  const { hasSession } = useLoaderData<typeof loader>();

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [bodyValue, setBodyValue] = useAtom(bodyValueAtom);
  const [titleValue, setTitleValue] = useAtom(titleValueAtom);

  const initializeEditorState = useCallback(async () => {
    await initializeEditorStorageInstance();

    const storage = await getEditorStorageInstance();
    const value = await storage.get('new');

    if (value != null) {
      setBodyValue(value.body);
      setTitleValue(value.title);
    } else {
      storage?.set('new', { title: '', body: '' });
    }

    setStorage(storage);
  }, [setBodyValue, setTitleValue]);

  const handleChangeTitle = useCallback(
    (value: string) => {
      setTitleValue(value);

      if (storage != null) {
        storage.set('new', { title: value, body: bodyValue });
      }
    },
    [bodyValue, setTitleValue, storage],
  );

  const handleChangeBody = useCallback(
    (value: string) => {
      setBodyValue(value);

      if (storage != null) {
        storage.set('new', { title: titleValue, body: value });
      }
    },
    [setBodyValue, storage, titleValue],
  );

  const handleClickSubmitButton = useCallback(async () => {
    fetcher.submit(
      {
        contents: bodyValue,
        title: titleValue,
      },
      { method: 'POST' },
    );
  }, [bodyValue, fetcher, titleValue]);

  useEffect(() => {
    initializeEditorState();
  }, [initializeEditorState]);

  if (!hasSession) {
    return (
      <>
        <Header>
          <AccountMenu hasSession={false} />
        </Header>
        <main>
          <p className="max-w-screen-md mx-auto pb-16 px-2">You need to sign in to create a new entry.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header>
        <SubmitButton onClick={handleClickSubmitButton} />
      </Header>
      <main className="pb-16">
        <ClientOnly fallback={<Loading />}>
          {() =>
            storage != null ? (
              <Editor
                title={titleValue}
                body={bodyValue}
                onChangeBody={handleChangeBody}
                onChangeTitle={handleChangeTitle}
              />
            ) : (
              <></>
            )
          }
        </ClientOnly>
      </main>
    </>
  );
}
