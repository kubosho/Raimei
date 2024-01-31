import { Session } from '@supabase/supabase-js';
import { atom } from 'jotai/vanilla';

export const userSessionAtom = atom<Session | null>(null);
