/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        SESSION_KEY?: string;
        SUPABASE_ANON_KEY?: string;
        SUPABASE_URL?: string;
      }
    }
  }
}
