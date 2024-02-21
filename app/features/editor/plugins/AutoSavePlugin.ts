import type { KvsLocalStorage } from '@kvs/node-localstorage';
import useLexicalComposerContextPkg from '@lexical/react/LexicalComposerContext.js';
import { useCallback, useEffect } from 'react';
import { EditorState } from 'lexical';

import { EditorStorageSchema } from '../../../local_storage/editor_storage_schema';

const { useLexicalComposerContext } = useLexicalComposerContextPkg;

interface Params {
  storage: KvsLocalStorage<EditorStorageSchema>;
}

export function AutoSavePlugin({ storage }: Params) {
  const [editor] = useLexicalComposerContext();

  const saveEditorState = useCallback(
    async (editorState: EditorState) => {
      storage.set('textEditorState', JSON.stringify(editorState));
    },
    [storage],
  );

  useEffect(() => {
    const teardown = editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
        return;
      }

      saveEditorState(editorState);
    });

    return () => {
      teardown();
    };
  }, [editor, saveEditorState]);

  return null;
}
