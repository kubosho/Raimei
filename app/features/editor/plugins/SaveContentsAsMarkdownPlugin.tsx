import LexicalMarkdownPkg from '@lexical/markdown';
import useLexicalComposerContextPkg from '@lexical/react/LexicalComposerContext.js';
import { useSetAtom } from 'jotai/react';
import { useEffect } from 'react';

import { bodyValueAsMarkdownAtom } from '../atoms/body_value_as_markdown_atom';

const { $convertToMarkdownString } = LexicalMarkdownPkg;
const { useLexicalComposerContext } = useLexicalComposerContextPkg;

export function SaveContentsAsMarkdownPlugin() {
  const [editor] = useLexicalComposerContext();

  const setBodyValueAsMarkdown = useSetAtom(bodyValueAsMarkdownAtom);

  useEffect(() => {
    const teardown = editor.registerUpdateListener(() => {
      editor.update(() => {
        let markdown = $convertToMarkdownString();
        // Extra newlines are output during Markdown conversion because of the two \n's in createMarkdownExport().
        // see: https://github.com/facebook/lexical/blob/ffd9521/packages/lexical-markdown/src/MarkdownExport.ts#L55
        markdown = markdown.replace(/\n\n/g, '\n');
        setBodyValueAsMarkdown(markdown);
      });
    });

    return () => {
      teardown();
    };
  }, [editor, setBodyValueAsMarkdown]);

  return null;
}
