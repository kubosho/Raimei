import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

import { destroySession, getSession } from '../features/auth/cookie_session_storage.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};
