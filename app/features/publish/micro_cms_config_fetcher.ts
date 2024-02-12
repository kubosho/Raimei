import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../types/database.types';

import type { MicroCmsClientConfig } from './types/micro_cms_client_config';

export async function fetchMicroCmsConfig(supabaseClient: SupabaseClient<Database>): Promise<MicroCmsClientConfig | null> {
  const { data } = await supabaseClient.from('micro_cms_configs').select();
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const microCmsConfig = data
    ?.filter((d) => d.supabase_user_id === session?.user.id)
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
