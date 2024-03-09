import { atom } from 'jotai/vanilla';

import type { AlertState } from '../../../components/Alert';

export const alertStateAtom = atom<AlertState | null>(null);
