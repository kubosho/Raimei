import { Await } from '@remix-run/react';
import { useAtom, useAtomValue } from 'jotai/react';
import { Suspense, useCallback, useEffect } from 'react';
import { type ChangeEvent } from 'react';

import { appStorageAtom } from '../../../storage/atoms/app_storage_atom';
import { titleValueAtom } from '../atoms/title_value_atom';

export default function TitleEditor() {
  const appStorage = useAtomValue(appStorageAtom);

  const [titleValue, setTitleValue] = useAtom(titleValueAtom);

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setTitleValue(value);
    appStorage.set('titleEditorState', value);
  };

  const loadTitleEditorState = useCallback(async () => {
    appStorage.get('titleEditorState').then((titleEditorState) => {
      if (titleEditorState != null) {
        setTitleValue(titleEditorState);
      }
    });
  }, [appStorage, setTitleValue]);

  useEffect(() => {
    loadTitleEditorState();
  }, [loadTitleEditorState]);

  return (
    <>
      <label className="sr-only text-gray-900" htmlFor="entry-title">
        Entry title
      </label>
      <Suspense fallback={<div>loading...</div>}>
        <Await resolve={loadTitleEditorState}>
          {() => (
            <input
              type="text"
              name="entry-title"
              id="entry-title"
              value={titleValue}
              className="focus:outline-none leading-relaxed placeholder-gray-500 text-2xl w-full"
              placeholder="Write the title"
              onChange={handleChangeValue}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}
