import { vitePlugin } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';

installGlobals();

export default defineConfig({
  plugins: [vitePlugin()],
});
