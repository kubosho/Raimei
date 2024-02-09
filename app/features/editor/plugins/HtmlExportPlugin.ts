import $generateHtmlFromNodesPkg from '@lexical/html';
import useLexicalComposerContextPkg from '@lexical/react/LexicalComposerContext.js';
import { useEffect } from 'react';

const { $generateHtmlFromNodes } = $generateHtmlFromNodesPkg;
const { useLexicalComposerContext } = useLexicalComposerContextPkg;

interface Params {
  exportAsHtml: (contentAsHTML: string) => void;
}

export function HtmlExportPlugin({ exportAsHtml: exportAsHTML }: Params) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const teardown = editor.registerUpdateListener(() => {
      editor.update(() => {
        const contentAsHTML = $generateHtmlFromNodes(editor);
        exportAsHTML(contentAsHTML);
      });
    });

    return () => {
      teardown();
    };
  });

  return null;
}
