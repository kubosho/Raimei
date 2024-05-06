import { KvsEnvStorage } from '@kvs/env/lib/share';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useAtom } from 'jotai/react';
import { useCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { cmsContentsRepository } from '../cms/cms_contents_repository';
import Loading from '../components/Loading';
import { titleValueAtom } from '../features/editor/atoms/title_value_atom';
import { bodyValueAtom } from '../features/editor/atoms/body_value_atom';
import Editor from '../features/editor/components/Editor';
import AccountMenu from '../features/navigation/AccountMenu';
import Header from '../features/navigation/Header';
import { getEditorStorageInstance, initializeEditorStorageInstance } from '../local_storage/editor_storage.client';
import type { EditorStorageSchema } from '../local_storage/editor_storage_schema.client';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const repository = cmsContentsRepository();
  if (repository == null) {
    return json({
      contents: null,
      hasSession: false,
    });
  }

  const contents = await repository.fetch({
    contentsId: params.id,
  });

  return json({
    contents,
    hasSession: true,
  });
};

export default function Entry() {
  const { contents, hasSession } = useLoaderData<typeof loader>();

  const [storage, setStorage] = useState<KvsEnvStorage<EditorStorageSchema> | null>(null);

  const [bodyValue, setBodyValue] = useAtom(bodyValueAtom);
  const [titleValue, setTitleValue] = useAtom(titleValueAtom);

  const initializeEditorState = useCallback(async () => {
    await initializeEditorStorageInstance();

    const storage = await getEditorStorageInstance();

    if (contents != null) {
      const value = await storage.get(contents?.id);

      if (value != null) {
        setBodyValue(value.body);
        setTitleValue(value.title);
      } else if (contents != null) {
        setBodyValue(contents.body);
        setTitleValue(contents.title);
        storage.set(contents.id, { title: contents.title, body: contents.body });
      }
    }

    setStorage(storage);
  }, [contents, setBodyValue, setTitleValue]);

  const handleChangeTitle = useCallback(
    async (value: string) => {
      setTitleValue(value);

      if (contents != null && storage != null) {
        storage.set(contents.id, { title: value, body: bodyValue });
      }
    },
    [bodyValue, contents, setTitleValue, storage],
  );

  const handleChangeBody = useCallback(
    async (value: string) => {
      setBodyValue(value);

      if (contents != null && storage != null) {
        storage.set(contents.id, { title: titleValue, body: value });
      }
    },
    [setBodyValue, contents, storage, titleValue],
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
