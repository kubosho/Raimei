import type { KvsEnvStorage } from '@kvs/env/lib/share';
import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useActionData, useFetcher } from '@remix-run/react';
import { useAtom, useSetAtom } from 'jotai/react';
import { useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { getCmsApiUrl } from '../external_services/cms/cms_api_url';
import { createCmsContentsRepository } from '../external_services/cms/cms_contents_repository';
import Loading from '../components/Loading';
import { createSupabaseServerClient } from '../external_services/database/supabase_server_client.server';
import { alertStateAtom } from '../features/alert/atoms/alert_state_atom';
import { authenticator } from '../features/auth/auth.server';
import { bodyValueAtom } from '../features/editor/atoms/body_value_atom';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import Editor from '../features/editor/components/Editor';
import SubmitButton from '../features/editor/components/SubmitButton';
import Header from '../features/navigation/Header';
import { fetchMicroCmsClientConfig } from '../features/publish/micro_cms_client_config_fetcher.server';
import {
  getEditorStorageInstance,
  initializeEditorStorageInstance,
} from '../global_objects/indexed_db/editor_storage.client';
import type { EditorStorageSchema } from '../global_objects/indexed_db/editor_storage_schema.client';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return redirect('/login');
  }

  return null;
};

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

export const meta: MetaFunction = () => {
  return [{ title: 'New entry — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function EntryNew() {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [bodyValue, setBodyValue] = useAtom(bodyValueAtom);
  const [titleValue, setTitleValue] = useAtom(titleValueAtom);

  const setAlertState = useSetAtom(alertStateAtom);

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
    },
    [setTitleValue],
  );

  const handleChangeBody = useCallback(
    (value: string) => {
      setBodyValue(value);
    },
    [setBodyValue],
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

  useEffect(() => {
    if (storage != null) {
      storage.set('new', { title: titleValue, body: bodyValue });
    }
  }, [bodyValue, storage, titleValue]);

  useEffect(() => {
    if (actionData == null) {
      return;
    }

    setAlertState({
      type: 'success',
      message: 'Post created',
    });
  }, [actionData, setAlertState]);

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
