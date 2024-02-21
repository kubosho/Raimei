import { describe, expect, test } from 'vitest';

import {
  getMicroCmsConfigCacheStorage,
  initializeMicroCmsConfigCacheStorage,
} from '../micro_cms_config_cache_storage.server';

describe('micro_cms_config_cache_storage.server', () => {
  describe('getMicroCmsConfigCacheStorage()', () => {
    test('cache storage is not initialized, thrown error', () => {
      // Then
      expect(() => getMicroCmsConfigCacheStorage()).toThrowError(
        'Cache is not initialized, call initializeMicroCmsClientConfigCache() first',
      );
    });

    test('cache storage is initialized, return that instance', () => {
      // Given
      initializeMicroCmsConfigCacheStorage();

      // When
      const cache = getMicroCmsConfigCacheStorage();

      // Then
      expect(cache).not.toBeNull();
    });
  });
});
