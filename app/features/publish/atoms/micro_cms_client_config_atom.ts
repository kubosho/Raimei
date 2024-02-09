import { atom } from 'jotai/vanilla';

import { MicroCmsClientConfig } from '../types/micro_cms_client_config';

export const microCmsClientConfigAtom = atom<MicroCmsClientConfig | null>(null);
