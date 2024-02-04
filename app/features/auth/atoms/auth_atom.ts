import { atom } from 'jotai/vanilla';

import { Auth } from '..';

export const authAtom = atom<Auth | null>(null);
