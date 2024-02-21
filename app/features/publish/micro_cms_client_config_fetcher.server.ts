import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../types/database.types';

import { getMicroCmsConfigCacheStorage } from '../../local_storage/micro_cms_config_cache_storage.server';
import type { MicroCmsClientConfig } from './types/micro_cms_client_config';

interface Params {
  supabaseClient: SupabaseClient<Database>;
  userId: string;
}

export async function fetchMicroCmsClientConfig({
  supabaseClient,
  userId,
}: Params): Promise<MicroCmsClientConfig | null> {
  const cacheStorage = getMicroCmsConfigCacheStorage();

  const cachedConfig = cacheStorage.get(userId);
  if (cachedConfig != null) {
    return cachedConfig;
  }

  const { data } = await supabaseClient.from('micro_cms_configs').select();
  if (data == null) {
    return null;
  }

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

  cacheStorage.set(userId, microCmsConfig);

  return microCmsConfig;
}
