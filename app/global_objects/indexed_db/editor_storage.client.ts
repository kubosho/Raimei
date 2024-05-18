import { kvsEnvStorage } from '@kvs/env';
import type { KvsEnvStorage } from '@kvs/env/lib/share';

import type { EditorStorageSchema } from './editor_storage_schema.client';

type Storage = KvsEnvStorage<EditorStorageSchema>;

const KEY = Symbol('EditorStorage');

const _storage = new Map<typeof KEY, Storage>();

export const initializeEditorStorageInstance = async (): Promise<void> => {
  if (_storage.get(KEY) != null) {
    return;
  }

  const storage = await kvsEnvStorage<EditorStorageSchema>({
    name: 'RaimeiEditor',
    version: 1,
  });

  _storage.set(KEY, storage);
};

export const clearEditorStorageInstance = (): void => {
  _storage.clear();
};

export const getEditorStorageInstance = (): Storage => {
  if (!_storage.has(KEY)) {
    throw new Error('Storage is not initialized, call initializeEditorStorageInstance() first');
  }

  return _storage.get(KEY)!;
};
