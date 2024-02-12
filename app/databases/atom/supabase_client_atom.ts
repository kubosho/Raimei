import type { SupabaseClient } from '@supabase/supabase-js';
import { atom } from 'jotai/vanilla';

import { Database } from '../../../types/database.types';

export const supabaseClientAtom = atom<SupabaseClient<Database> | null>(null);
