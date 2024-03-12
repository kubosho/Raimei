import type { KvsEnvStorage } from '@kvs/env/lib/share';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useAtom, useAtomValue } from 'jotai/react';
import { createClient } from 'microcms-js-sdk';
import { useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import Loading from '../components/Loading';
import { getSession } from '../features/auth/cookie_session_storage.server';
import { bodyValueAsMarkdownAtom } from '../features/editor/atoms/body_value_as_markdown_atom';
import { bodyValueAtom } from '../features/editor/atoms/body_value_atom';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import Editor from '../features/editor/components/Editor';
import SubmitButton from '../features/editor/components/SubmitButton';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { microCmsClientAtom } from '../features/publish/atoms/micro_cms_client_atom';
import { microCmsClientConfigAtom } from '../features/publish/atoms/micro_cms_client_config_atom';
import { getEditorStorageInstance, initializeEditorStorageInstance } from '../local_storage/editor_storage.client';
import type { EditorStorageSchema } from '../local_storage/editor_storage_schema.client';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  const hasSession = userId != null;

  return json({ hasSession });
};

export const meta: MetaFunction = () => {
  return [{ title: 'New entry — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function EntryNew() {
  const { hasSession } = useLoaderData<typeof loader>();

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [microCmsClient, setMicroCmsClient] = useAtom(microCmsClientAtom);

  const bodyAsMarkdown = useAtomValue(bodyValueAsMarkdownAtom);
  const [bodyValue, setBodyValue] = useAtom(bodyValueAtom);
  const [titleValue, setTitleValue] = useAtom(titleValueAtom);
  const microCmsClientConfig = useAtomValue(microCmsClientConfigAtom);

  const createMicroCmsClient = useCallback(() => {
    const config = microCmsClientConfig;
    if (config == null || config.apiKey === '' || config.serviceId === '') {
      return;
    }

    const client = createClient({
      apiKey: config.apiKey,
      serviceDomain: config.serviceId,
    });
    setMicroCmsClient(client);
  }, [microCmsClientConfig, setMicroCmsClient]);

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
    if (microCmsClientConfig == null || microCmsClient == null) {
      return;
    }

    await microCmsClient.create({
      endpoint: microCmsClientConfig.endpoint,
      content: {
        content: bodyAsMarkdown,
        title: titleValue,
      },
    });
  }, [bodyAsMarkdown, microCmsClient, microCmsClientConfig, titleValue]);

  useEffect(() => {
    createMicroCmsClient();
    initializeEditorState();
  }, [createMicroCmsClient, initializeEditorState]);

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
