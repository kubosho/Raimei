import { afterEach, describe, expect, test } from 'vitest';

import {
  clearMicroCmsConfigCacheInstance,
  getMicroCmsConfigCacheInstance,
  initializeMicroCmsConfigCacheInstance,
} from '../micro_cms_config_cache.server';

afterEach(() => {
  clearMicroCmsConfigCacheInstance();
});

describe('MicroCmsConfigCache', () => {
  describe('getMicroCmsConfigCacheStorage()', () => {
    test('cache is not initialized, thrown error', () => {
      // Then
      expect(() => getMicroCmsConfigCacheInstance()).toThrowError(
        'Cache is not initialized, call initializeMicroCmsConfigCacheInstance() first',
      );
    });

    test('cache is initialized, return that instance', () => {
      // Given
      initializeMicroCmsConfigCacheInstance();

      // When
      const cache = getMicroCmsConfigCacheInstance();

      // Then
      expect(cache).not.toBeNull();
    });
  });
});
