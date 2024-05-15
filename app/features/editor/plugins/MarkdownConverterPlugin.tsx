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
        const markdown = $convertToMarkdownString();
        onChange(markdown);
      });
    });

    return () => {
      teardown();
    };
  }, [editor, onChange]);

  return null;
}
