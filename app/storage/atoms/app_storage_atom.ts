import { kvsEnvStorage } from '@kvs/env';
import { atom } from 'jotai/vanilla';

import type { AppStorageSchema } from '../app_storage_schema';

export const appStorageAtom = atom(
  async () =>
    await kvsEnvStorage<AppStorageSchema>({
      name: 'Raimei',
      version: 1,
    }),
);
