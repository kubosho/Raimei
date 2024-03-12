import TTLCache from '@isaacs/ttlcache';

import { SESSION_MAX_AGE } from '../constants/session_max_age';
import type { MicroCmsClientConfig } from '../features/publish/types/micro_cms_client_config';

const KEY = Symbol('MicroCmsConfigCache');

const _cache = new Map<typeof KEY, TTLCache<string, MicroCmsClientConfig>>();

export const initializeMicroCmsConfigCacheInstance = (): void => {
  if (_cache.get(KEY) != null) {
    return;
  }

  _cache.set(
    KEY,
    new TTLCache<string, MicroCmsClientConfig>({
      max: 10,
      ttl: SESSION_MAX_AGE * 1000,
    }),
  );
};

export const clearMicroCmsConfigCacheInstance = (): void => {
  _cache?.clear();
};

export const getMicroCmsConfigCacheInstance = (): TTLCache<string, MicroCmsClientConfig> => {
  if (!_cache.has(KEY)) {
    throw new Error('Cache is not initialized, call initializeMicroCmsConfigCacheInstance() first');
  }

  return _cache.get(KEY)!;
};
