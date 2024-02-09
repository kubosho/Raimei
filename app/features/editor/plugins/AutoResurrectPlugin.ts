import type { KvsLocalStorage } from '@kvs/node-localstorage';
import useLexicalComposerContextPkg from '@lexical/react/LexicalComposerContext.js';
import { useCallback, useEffect } from 'react';

import type { AppStorageSchema } from '../../../storage/app_storage_schema';

const { useLexicalComposerContext } = useLexicalComposerContextPkg;

interface Params {
  storage: KvsLocalStorage<AppStorageSchema>;
}

export function AutoResurrectPlugin({ storage }: Params) {
  const [editor] = useLexicalComposerContext();

  const loadEditorState = useCallback(async () => {
    return storage.get('textEditorState');
  }, [storage]);

  useEffect(() => {
    loadEditorState().then((serializedEditorState) => {
      if (!serializedEditorState || typeof serializedEditorState !== 'string') {
        return;
      }

      const editorState = editor.parseEditorState(serializedEditorState);
      editor.setEditorState(editorState);
    });
  }, [editor, loadEditorState]);

  return null;
}