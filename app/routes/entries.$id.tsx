import { KvsEnvStorage } from '@kvs/env/lib/share';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useAtom } from 'jotai/react';
import { createClient } from 'microcms-js-sdk';
import { useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import type { MicroCmsApiSchema } from '../../types/micro_cms_api_schema.types';
import Loading from '../components/Loading';
import { createSupabaseServerClient } from '../database/supabase_server_client.server';
import { getSession } from '../features/auth/cookie_session_storage.server';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import { bodyValueAtom } from '../features/editor/atoms/body_value_atom';
import Editor from '../features/editor/components/Editor';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { fetchMicroCmsClientConfig } from '../features/publish/micro_cms_client_config_fetcher.server';
import { getEditorStorageInstance, initializeEditorStorageInstance } from '../local_storage/editor_storage.client';
import type { EditorStorageSchema } from '../local_storage/editor_storage_schema.client';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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
  const microCmsData = await client.get<MicroCmsApiSchema>({ endpoint: config.endpoint, contentId: params.id });

  return json({ hasSession: true, microCmsData });
};

export default function Entry() {
  const { hasSession, microCmsData } = useLoaderData<typeof loader>();

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [bodyValue, setBodyValue] = useAtom(bodyValueAtom);
  const [titleValue, setTitleValue] = useAtom(titleValueAtom);

  const initializeEditorState = useCallback(async () => {
    await initializeEditorStorageInstance();

    const storage = await getEditorStorageInstance();

    if (microCmsData != null) {
      const value = await storage.get(microCmsData.id);

      if (value != null) {
        setBodyValue(value.body);
        setTitleValue(value.title);
      } else if (microCmsData != null) {
        setBodyValue(microCmsData.body);
        setTitleValue(microCmsData.title);
        storage.set(microCmsData.id, { title: microCmsData.title, body: microCmsData.body });
      }
    }

    setStorage(storage);
  }, [microCmsData, setBodyValue, setTitleValue]);

  const handleChangeTitle = useCallback(
    async (value: string) => {
      setTitleValue(value);

      if (microCmsData != null && storage != null) {
        storage.set(microCmsData.id, { title: value, body: bodyValue });
      }
    },
    [bodyValue, microCmsData, setTitleValue, storage],
  );

  const handleChangeBody = useCallback(
    async (value: string) => {
      setBodyValue(value);

      if (microCmsData != null && storage != null) {
        storage.set(microCmsData.id, { title: titleValue, body: value });
      }
    },
    [setBodyValue, microCmsData, storage, titleValue],
  );

  useEffect(() => {
    initializeEditorState();
  }, [initializeEditorState]);

  return (
    <>
      <Header>
        <AccountMenu hasSession={hasSession} />
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
