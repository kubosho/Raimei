import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../types/database.types';
import { getSession } from '../auth/cookie_session_storage.server';

import type { MicroCmsClientConfig } from './types/micro_cms_client_config';

interface Params {
  request: Request;
  supabaseClient: SupabaseClient<Database>;
}

export async function fetchMicroCmsClientConfig({
  request,
  supabaseClient,
}: Params): Promise<MicroCmsClientConfig | null> {
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('accessToken');
  if (accessToken == null) {
    return null;
  }

  const [{ error }, { data }] = await Promise.all([
    supabaseClient.auth.getUser(accessToken),
    supabaseClient.from('micro_cms_configs').select(),
  ]);
  if (data == null || error != null) {
    return null;
  }

  const userId = session.get('userId');
  const microCmsConfig = data
    .filter((d) => d.supabase_user_id === userId)
    .map((d) => {
      return {
        apiKey: d.api_key ?? '',
        endpoint: d.endpoint ?? '',
        serviceId: d.service_id ?? '',
      };
    })
    .at(0);
  if (microCmsConfig == null) {
    return null;
  }

  return microCmsConfig;
}
