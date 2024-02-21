import type { KvsEnvStorage } from '@kvs/env/lib/share';
import { useAtom } from 'jotai/react';
import { useCallback, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import type { EditorStorageSchema } from '../../../local_storage/editor_storage_schema.client';
import { titleValueAtom } from '../atoms/title_value_atom';

interface Props {
  storage: KvsEnvStorage<EditorStorageSchema> | null;
}

export default function TitleEditor({ storage }: Props): JSX.Element {
  const [titleValue, setTitleValue] = useAtom(titleValueAtom);

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setTitleValue(value);

    if (storage != null) {
      storage.set('titleEditorState', value);
    }
  };

  const loadTitleEditorState = useCallback(async () => {
    storage?.get('titleEditorState').then((titleEditorState) => {
      if (titleEditorState != null) {
        setTitleValue(titleEditorState);
      }
    });
  }, [storage, setTitleValue]);

  useEffect(() => {
    loadTitleEditorState();
  }, [loadTitleEditorState]);

  return (
    <>
      <label className="sr-only text-gray-900" htmlFor="entry-title">
        Entry title
      </label>
      <input
        type="text"
        name="entry-title"
        id="entry-title"
        value={titleValue}
        className="focus:outline-none leading-relaxed placeholder-gray-500 text-2xl w-full"
        placeholder="Write the title"
        onChange={handleChangeValue}
      />
    </>
  );
}
