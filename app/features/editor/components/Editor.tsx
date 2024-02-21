import type { KvsEnvStorage } from '@kvs/env/lib/share';

import type { EditorStorageSchema } from '../../../local_storage/editor_storage_schema.client';

import TextEditor from './TextEditor';
import TitleEditor from './TitleEditor';

interface Props {
  storage: KvsEnvStorage<EditorStorageSchema> | null;
}

export default function Editor({ storage }: Props): JSX.Element {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full max-w-screen-md mx-auto px-2 w-full">
      <TitleEditor storage={storage} />

      <div className="mt-10">
        <TextEditor storage={storage} />
      </div>
    </div>
  );
}
