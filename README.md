# 雷鳴 (Raimei)

Raimei is a blog editor to quickly start writing.

## Development

### Requirements

* [Supabase](https://supabase.com/) account
* Setup environments variables
  * `SESSION_KEY`
    * This variable is used in the `secrets` property defined in [CookieSignatureOptions in @remix/server-runtime](https://github.com/remix-run/remix/blob/6814a1d/packages/remix-server-runtime/cookies.ts#L10-L18)
  * `SUPABASE_ACCESS_TOKEN`
  * `SUPABASE_ANON_KEY`
  * `SUPABASE_PROJECT_ID`
  * `SUPABASE_URL`
* [pnpm](https://pnpm.io/)

### Start the development server

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Directory structure

The app directory structure is outlined below:

* app
  * components: components not related to a domain

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
