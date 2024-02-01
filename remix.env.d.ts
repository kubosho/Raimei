/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        SUPABASE_ANON_KEY?: string;
        SUPABASE_URL?: string;
      }
    }
  }
}
