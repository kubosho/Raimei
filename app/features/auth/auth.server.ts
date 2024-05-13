import { Authenticator } from 'remix-auth';

import { cookieSessionStorage } from './cookie_session_storage.server';
import { UserData, supabaseStrategy } from './supabase_user_strategy.server';

const authenticator = new Authenticator<UserData | null>(cookieSessionStorage);
authenticator.use(supabaseStrategy());

export { authenticator };
