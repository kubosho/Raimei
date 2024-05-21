import type { User } from '@supabase/supabase-js';
import { Factory } from 'fishery';
import { UserAppMetadataFactory } from './user_app_metadata_factory';
import { UserMetadataFactory } from './user_metadata_factory';

export const UserFactory = Factory.define<User>(({ sequence }) => ({
  id: `${sequence}`,
  app_metadata: UserAppMetadataFactory.build(),
  user_metadata: UserMetadataFactory.build(),
  created_at: '',
  aud: '',
}));
