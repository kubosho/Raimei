import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { LexicalEditor } from 'lexical';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

import AppErrorBoundary from '../../../components/AppErrorBoundary';
import { MarkdownConverterPlugin } from '../plugins/MarkdownConverterPlugin';
import { textEditorThemeConfig } from '../text_editor_theme_config';

interface Props {
  title: string;
  body: string;
  onChangeTitle: (title: string) => void;
  onChangeBody: (body: string) => void;
}

const EDITOR_NODES = [CodeNode, HeadingNode, LinkNode, ListNode, ListItemNode, QuoteNode];

export default function Editor({ title, body, onChangeTitle, onChangeBody }: Props): JSX.Element {
  const [titleValue, setTitleValue] = useState(title);
  const [bodyValue, setBodyValue] = useState(body);

  const initialConfig: Readonly<InitialConfigType> = {
    editorState: bodyValue !== '' ? () => $convertFromMarkdownString(bodyValue, TRANSFORMERS) : null,
    namespace: 'RaimeiEditor',
    nodes: EDITOR_NODES,
    onError: (error: Error, editor: LexicalEditor) => {
      console.error(error, editor);
    },
    theme: textEditorThemeConfig,
  };

  const handleChangeTitle = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setTitleValue(value);
    onChangeTitle(value);
  };

  const handleChangeBody = (value: string) => {
    setBodyValue(value);
    onChangeBody(value);
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-full max-w-screen-md mx-auto px-2 w-full">
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
        onChange={handleChangeTitle}
      />

      <AppErrorBoundary>
        <div className="mt-10">
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
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <MarkdownConverterPlugin onChange={handleChangeBody} />
          </LexicalComposer>
        </div>
      </AppErrorBoundary>
    </div>
  );
}
