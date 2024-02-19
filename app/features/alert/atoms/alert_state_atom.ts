import { atom } from 'jotai/vanilla';

import type { AlertState } from '../../../common_components/Alert';

export const alertStateAtom = atom<AlertState | null>(null);
