import type { KvsEnvStorage } from '@kvs/env/lib/share';
import CodePkg from '@lexical/code';
import LinkPkg from '@lexical/link';
import ListPkg from '@lexical/list';
import LexicalMarkdownPkg from '@lexical/markdown';
import RichTextPkg from '@lexical/rich-text';
import LexicalComposerPkg from '@lexical/react/LexicalComposer.js';
import type { InitialConfigType } from '@lexical/react/LexicalComposer.js';
import ContentEditablePkg from '@lexical/react/LexicalContentEditable.js';
import HistoryPluginPkg from '@lexical/react/LexicalHistoryPlugin.js';
import MarkdownShortcutPluginPkg from '@lexical/react/LexicalMarkdownShortcutPlugin.js';
import RichTextPluginPkg from '@lexical/react/LexicalRichTextPlugin.js';
import type { LexicalEditor } from 'lexical';

import AppErrorBoundary from '../../../common_components/AppErrorBoundary';
import type { EditorStorageSchema } from '../../../storage/editor_storage_schema';
import { AutoResurrectPlugin } from '../plugins/AutoResurrectPlugin';
import { AutoSavePlugin } from '../plugins/AutoSavePlugin';
import { textEditorThemeConfig } from '../text_editor_theme_config';
import { SaveContentsAsMarkdownPlugin } from '../plugins/SaveContentsAsMarkdownPlugin';

interface Props {
  storage: KvsEnvStorage<EditorStorageSchema> | null;
}

const { CodeNode } = CodePkg;
const { LinkNode } = LinkPkg;
const { ListNode, ListItemNode } = ListPkg;
const { HeadingNode, QuoteNode } = RichTextPkg;

const { TRANSFORMERS } = LexicalMarkdownPkg;
const { LexicalComposer } = LexicalComposerPkg;
const { ContentEditable } = ContentEditablePkg;
const { RichTextPlugin } = RichTextPluginPkg;
const { HistoryPlugin } = HistoryPluginPkg;
const { MarkdownShortcutPlugin } = MarkdownShortcutPluginPkg;

const EDITOR_NODES = [CodeNode, HeadingNode, LinkNode, ListNode, ListItemNode, QuoteNode];

const initialConfig: InitialConfigType = {
  namespace: 'RaimeiEditor',
  nodes: EDITOR_NODES,
  onError: (error: Error, editor: LexicalEditor) => {
    console.error(error, editor);
  },
  theme: textEditorThemeConfig,
};

export default function TextEditor({ storage }: Props): JSX.Element {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="h-full relative">
        <RichTextPlugin
          contentEditable={<ContentEditable className="focus:outline-none h-full" />}
          placeholder={
            <p className="absolute left-0 pointer-events-none select-none text-gray-500 top-0">Write the texts</p>
          }
          ErrorBoundary={AppErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      {storage != null ? (
        <>
          <AutoSavePlugin storage={storage} />
          <AutoResurrectPlugin storage={storage} />
        </>
      ) : null}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <SaveContentsAsMarkdownPlugin />
    </LexicalComposer>
  );
}
