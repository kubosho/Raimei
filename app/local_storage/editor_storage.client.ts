import { kvsEnvStorage } from '@kvs/env';
import type { KvsEnvStorage } from '@kvs/env/lib/share';

import type { EditorStorageSchema } from '../local_storage/editor_storage_schema.client';

type Storage = KvsEnvStorage<EditorStorageSchema>;

const KEY = Symbol('EditorStorage');

const _storage = new Map<typeof KEY, Storage>();

export const getInstance = async (): Promise<Storage> => {
  if (!_storage.has(KEY)) {
    const storage = await kvsEnvStorage<EditorStorageSchema>({
      name: 'RaimeiEditor',
      version: 1,
    });

    _storage.set(KEY, storage);
  }

  return _storage.get(KEY)!;
};

export const clearInstance = (): void => {
  _storage.delete(KEY);
};
