import { afterEach, describe, expect, test } from 'vitest';

import {
  clearEditorStorageInstance,
  getEditorStorageInstance,
  initializeEditorStorageInstance,
} from '../editor_storage.client';

afterEach(() => {
  clearEditorStorageInstance();
});

describe('EditorStorage', () => {
  describe('getEditorStorageInstance()', () => {
    test('storage is not initialized, thrown error', () => {
      // Then
      expect(() => getEditorStorageInstance()).toThrowError(
        'Storage is not initialized, call initializeEditorStorageInstance() first',
      );
    });

    test('storage is after initialized, can get storage instance', async () => {
      // Given
      await initializeEditorStorageInstance();

      // When
      const storage = getEditorStorageInstance();

      // Then
      expect(storage).not.toBe(null);
    });

    test('storage instances are equal', async () => {
      // Given
      await initializeEditorStorageInstance();

      // When
      const storage = getEditorStorageInstance();

      // Then
      expect(storage).toEqual(getEditorStorageInstance());
    });
  });
});
