import { useAtom, useAtomValue } from 'jotai/react';
import { useEffect, type ChangeEvent } from 'react';

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

  const loadTitleEditorState = async () => {
    return appStorage.get('titleEditorState');
  };

  useEffect(() => {
    loadTitleEditorState().then((titleEditorState) => {
      if (titleEditorState != null) {
        setTitleValue(titleEditorState);
      }
    });
  });

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
        className="focus:outline-none leading-relaxed placeholder-gray-500 text-2xl"
        placeholder="Write the title"
        onChange={handleChangeValue}
      />
    </>
  );
}
