import type { EditorThemeClasses } from 'lexical';

export const textEditorThemeConfig: EditorThemeClasses = {
  heading: {
    h1: 'leading-relaxed mt-10 text-4xl',
    h2: 'leading-relaxed mt-10 text-3xl',
    h3: 'leading-relaxed mt-10 text-2xl',
    h4: 'leading-relaxed mt-10 text-xl',
    h5: 'leading-relaxed text-lg',
    h6: 'leading-relaxed text-base',
  },
  image: 'h-auto max-w-full rounded',
  link: 'active:text-blue-600 decoration-1 text-blue-900 underline visited:text-blue-900',
  list: {
    ol: 'list-decimal mt-4',
    ul: 'list-disc mt-4',
  },
  paragraph: 'leading-relaxed mt-4 text-base',
  quote: `before:absolute before:content-['"'] before:left-2 before:text-4xl border-l-4 border-solid border-yellow-500 mt-4 pl-8 relative`,
};
