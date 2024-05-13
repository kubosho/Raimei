import type { LoaderFunctionArgs } from '@remix-run/node';

import { authenticator } from '../features/auth/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: '/' });

  return null;
};
