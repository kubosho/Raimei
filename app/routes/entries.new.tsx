import { randomBytes } from 'crypto';

import type { KvsEnvStorage } from '@kvs/env/lib/share';
import { Button } from '@radix-ui/themes';
import { json, redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
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
import { slugValueAtom } from '../features/editor/atoms/slug_value_atom';
import Editor from '../features/editor/components/Editor';
import Header from '../features/navigation/Header';
import { fetchMicroCmsConfig } from '../features/publish/micro_cms_config_fetcher.server';
import {
  getEditorStorageInstance,
  initializeEditorStorageInstance,
} from '../global_objects/indexed_db/editor_storage.client';
import type { EditorStorageSchema } from '../global_objects/indexed_db/editor_storage_schema.client';

const chars = 'abcdefghijklmnopqrstuvwxyz234567'.split('');

function generateRandomString(length: number): string {
  return randomBytes(length).reduce((p, i) => p + chars[i % 32], '');
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return redirect('/login');
  }

  const randomString = generateRandomString(8);

  return json({
    randomString,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userData = await authenticator.isAuthenticated(request);
  if (userData == null) {
    return null;
  }

  const supabaseClient = createSupabaseServerClient({ session: userData.session });

  const microCmsConfig = await fetchMicroCmsConfig({ supabaseClient, userId: userData.user.id });
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
    {
      contentsId: slug,
    },
  );

  return res;
};

export const meta: MetaFunction = () => {
  return [{ title: 'New entry — Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function EntryNew() {
  const fetcher = useFetcher();
  const { randomString } = useLoaderData<typeof loader>();

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [titleValue, setTitleValue] = useAtom(titleValueAtom);
  const [bodyValue, setBodyValue] = useAtom(bodyValueAtom);
  const [slugValue, setSlugValue] = useAtom(slugValueAtom);

  const setAlertState = useSetAtom(alertStateAtom);

  const initializeEditorState = useCallback(async () => {
    await initializeEditorStorageInstance();

    const storage = await getEditorStorageInstance();
    const value = await storage.get('new');

    if (value != null) {
      setBodyValue(value.body);
      setTitleValue(value.title);
      setSlugValue(value.slug);
    } else {
      storage?.set('new', { title: '', body: '', slug: randomString });
    }

    setStorage(storage);
  }, [randomString, setBodyValue, setSlugValue, setTitleValue]);

  const saveStorage = useCallback(
    (newData: Partial<Record<'title' | 'body' | 'slug', string>>) => {
      const data = { title: titleValue, body: bodyValue, slug: slugValue };
      if (storage != null) {
        storage.set('new', { ...data, ...newData });
      }
    },
    [bodyValue, slugValue, storage, titleValue],
  );

  const handleChangeTitle = useCallback(
    (value: string) => {
      setTitleValue(value);
      saveStorage({ title: value });
    },
    [saveStorage, setTitleValue],
  );

  const handleChangeBody = useCallback(
    (value: string) => {
      setBodyValue(value);
      saveStorage({ body: value });
    },
    [saveStorage, setBodyValue],
  );

  const handleChangeSlug = useCallback(
    (value: string) => {
      setSlugValue(value);
      saveStorage({ slug: value });
    },
    [saveStorage, setSlugValue],
  );

  const handleClickSubmitButton = useCallback(async () => {
    fetcher.submit(
      {
        title: titleValue,
        contents: bodyValue,
        slug: slugValue,
      },
      { method: 'POST' },
    );
  }, [bodyValue, fetcher, slugValue, titleValue]);

  useEffect(() => {
    initializeEditorState();
  }, [initializeEditorState]);

  useEffect(() => {
    if (fetcher.data == null) {
      return;
    }

    setAlertState({
      type: 'success',
      message: 'Post created',
    });
  }, [fetcher.data, setAlertState]);

  return (
    <>
      <Header>
        <Button type="button" onClick={handleClickSubmitButton}>
          Submit
        </Button>
      </Header>
      <main className="mt-8 pb-16">
        <ClientOnly fallback={<Loading />}>
          {() =>
            storage != null ? (
              <Editor
                title={titleValue}
                body={bodyValue}
                slug={slugValue}
                onChangeBody={handleChangeBody}
                onChangeTitle={handleChangeTitle}
                onChangeSlug={handleChangeSlug}
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
