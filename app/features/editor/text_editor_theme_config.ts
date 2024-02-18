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
  paragraph: 'leading-relaxed text-base',
};
