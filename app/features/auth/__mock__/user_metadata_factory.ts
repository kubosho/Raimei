import type { UserMetadata } from '@supabase/supabase-js';
import { Factory } from 'fishery';

export const UserMetadataFactory = Factory.define<UserMetadata>(() => ({}));
