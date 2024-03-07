import LexicalMarkdownPkg from '@lexical/markdown';
import useLexicalComposerContextPkg from '@lexical/react/LexicalComposerContext.js';
import { useEffect } from 'react';

const { $convertToMarkdownString } = LexicalMarkdownPkg;
const { useLexicalComposerContext } = useLexicalComposerContextPkg;

interface Props {
  onChange: (markdown: string) => void;
}

export function MarkdownConverterPlugin({ onChange }: Props): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const teardown = editor.registerUpdateListener(() => {
      editor.update(() => {
        let markdown = $convertToMarkdownString();
        // Extra newlines are output during Markdown conversion because of the two \n's in createMarkdownExport().
        // see: https://github.com/facebook/lexical/blob/ffd9521/packages/lexical-markdown/src/MarkdownExport.ts#L55
        markdown = markdown.replace(/\n\n/g, '\n');
        onChange(markdown);
      });
    });

    return () => {
      teardown();
    };
  }, [editor, onChange]);

  return null;
}
