import type { UserAppMetadata } from '@supabase/supabase-js';
import { Factory } from 'fishery';

export const UserAppMetadataFactory = Factory.define<UserAppMetadata>(() => ({}));
