import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
// import { Form, useNavigate } from '@remix-run/react';

import { createSupabaseServerClient } from '../databases/supabase_server_client.server';
// import { useAtomValue, useSetAtom } from 'jotai/react';
// import { userSessionAtom } from '../features/auth/atoms/user_session_atom';
// import { useCallback } from 'react';
// import type { FormEvent } from 'react';
// import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
// import { authAtom } from '../features/auth/atoms/auth_atom';

export async function loader({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  console.log('after');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabaseClient = createSupabaseServerClient({ request });
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.signInWithPassword({ email, password });

  console.log({ session, error });
  if (session != null && error == null) {
    return redirect('/');
  }

  return null;
}

// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const email = formData.get('email') as string;
//   const password = formData.get('password') as string;

//   const supabaseClient = createSupabaseServerClient({ request });

//   const {
//     data: { session },
//     error,
//   } = await supabaseClient.auth.signInWithPassword({ email, password });

//   if (session == null || error != null) {
//     return;
//   }

//   return redirect('/');
// }
