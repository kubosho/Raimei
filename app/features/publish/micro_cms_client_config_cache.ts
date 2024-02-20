import TTLCache from '@isaacs/ttlcache';

import { MicroCmsClientConfig } from './types/micro_cms_client_config';

let cache: TTLCache<string, MicroCmsClientConfig> | null = null;

export const initializeMicroCmsClientConfigCache = () =>
  (cache = new TTLCache<string, MicroCmsClientConfig>({
    max: 500,
    ttl: 60 * 60 * 1000,
  }));

export const destructMicroCmsClientConfigCache = () => {
  cache?.clear();
  cache = null;
};

export const getMicroCmsClientConfigCache = () => {
  if (cache == null) {
    throw new Error('Cache is not initialized, call initializeMicroCmsClientConfigCache() first');
  }

  return cache;
};
