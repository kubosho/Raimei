import { $convertToMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

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
