import TTLCache from '@isaacs/ttlcache';

import { SESSION_MAX_AGE } from '../constants/session_max_age';
import type { MicroCmsClientConfig } from '../features/publish/types/micro_cms_client_config';

let cache: TTLCache<string, MicroCmsClientConfig> | null = null;

export const initializeMicroCmsConfigCacheStorage = () => {
  if (cache != null) {
    return;
  }

  cache = new TTLCache<string, MicroCmsClientConfig>({
    max: 10,
    ttl: SESSION_MAX_AGE * 1000,
  });
};

export const destructMicroCmsConfigCacheStorage = () => {
  cache?.clear();
  cache = null;
};

export const getMicroCmsConfigCacheStorage = () => {
  if (cache == null) {
    throw new Error('Cache is not initialized, call initializeMicroCmsClientConfigCache() first');
  }

  return cache;
};
