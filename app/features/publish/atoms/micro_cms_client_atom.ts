import { atom } from 'jotai/vanilla';

import type { MicroCmsClient } from '../types/micro_cms_client';

export const microCmsClientAtom = atom<MicroCmsClient | null>(null);
