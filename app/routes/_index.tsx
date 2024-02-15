import { kvsEnvStorage } from '@kvs/env';
import type { KvsEnvStorage } from '@kvs/env/lib/share';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useAtom, useAtomValue } from 'jotai/react';
import { createClient } from 'microcms-js-sdk';
import { useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import Loading from '../common_components/Loading';
import { getSession } from '../features/auth/cookie_session_storage.server';
import { bodyValueAsMarkdownAtom } from '../features/editor/atoms/body_value_as_markdown_atom';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import SubmitButton from '../features/editor/components/SubmitButton';
import Editor from '../features/editor/components/Editor';
import Header from '../features/navigation/Header';
import { microCmsClientAtom } from '../features/publish/atoms/micro_cms_client_atom';
import { microCmsClientConfigAtom } from '../features/publish/atoms/micro_cms_client_config_atom';
import type { EditorStorageSchema } from '../storage/editor_storage_schema';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  return json({
    userId: session.get('userId'),
  });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Raimei' }, { name: 'description', content: 'Raimei is My blog editor.' }];
};

export default function Index() {
  const { userId } = useLoaderData<typeof loader>();
  const hasSession = userId != null;

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [microCmsClient, setMicroCmsClient] = useAtom(microCmsClientAtom);

  const bodyValue = useAtomValue(bodyValueAsMarkdownAtom);
  const titleValue = useAtomValue(titleValueAtom);
  const microCmsClientConfig = useAtomValue(microCmsClientConfigAtom);

  const createMicroCmsClient = useCallback(() => {
    const config = microCmsClientConfig;
    if (config == null) {
      return;
    }

    const client = createClient({
      apiKey: config.apiKey,
      serviceDomain: config.serviceId,
    });
    setMicroCmsClient(client);
  }, [microCmsClientConfig, setMicroCmsClient]);

  const handleClickSubmitButton = async () => {
    if (microCmsClientConfig == null || microCmsClient == null) {
      return;
    }

    await microCmsClient.create({
      endpoint: microCmsClientConfig.endpoint,
      content: {
        title: titleValue,
        content: bodyValue,
      },
    });
  };

  const initializeStorage = useCallback(async () => {
    const storage = await kvsEnvStorage<EditorStorageSchema>({
      name: 'RaimeiEditor',
      version: 1,
    });

    setStorage(storage);
  }, []);

  useEffect(() => {
    createMicroCmsClient();
    initializeStorage();
  }, [createMicroCmsClient, initializeStorage]);

  return (
    <>
      <Header hasSession={hasSession} isHiddenAuthComponent={false} />
      <main>
        <ClientOnly fallback={<Loading />}>{() => <Editor storage={storage} />}</ClientOnly>
        <div className="bottom-0 fixed max-w-screen-md mt-10 mx-auto w-full">
          <SubmitButton onClick={handleClickSubmitButton} />
        </div>
      </main>
    </>
  );
}
