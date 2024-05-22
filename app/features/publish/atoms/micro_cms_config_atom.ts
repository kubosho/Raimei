import { atom } from 'jotai/vanilla';

import { MicroCmsConfig } from '../types/micro_cms_config';

export const microCmsConfigAtom = atom<MicroCmsConfig | null>(null);
