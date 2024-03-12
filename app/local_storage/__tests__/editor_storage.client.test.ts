import { afterEach, describe, expect, test } from 'vitest';

import { clearInstance, getInstance } from '../editor_storage.client';

afterEach(() => {
  clearInstance();
});

describe('EditorStorage', () => {
  describe('getInstance()', () => {
    test('can get storage instance', async () => {
      // When
      const storage = await getInstance();

      // Then
      expect(storage).not.toBe(null);
    });

    test('storage instances are equal', async () => {
      // When
      const storage = await getInstance();

      // Then
      expect(storage).toEqual(await getInstance());
    });
  });
});
