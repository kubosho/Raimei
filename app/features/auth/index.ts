import type { AuthChangeEvent, AuthError, AuthTokenResponsePassword, Session, Subscription } from '@supabase/supabase-js';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

interface LoginParams {
  email: string;
  password: string;
}

type RetriveSessionReturnValue =
  | {
      data: {
        session: Session;
      };
      error: null;
    }
  | {
      data: {
        session: null;
      };
      error: AuthError;
    }
  | {
      data: {
        session: null;
      };
      error: null;
    };

type AuthStateChangeReturnValue = {
  data: {
    subscription: Subscription;
  };
};

export type AuthClient = Pick<
  SupabaseAuthClient,
  'getSession' | 'onAuthStateChange' | 'signInWithPassword' | 'signOut'
>;

export class Auth {
  private _client: AuthClient;

  constructor(client: AuthClient) {
    this._client = client;
  }

  async login({ email, password }: LoginParams): Promise<AuthTokenResponsePassword> {
    return await this._client.signInWithPassword({
      email,
      password,
    });
  }

  async logout(): Promise<void> {
    await this._client.signOut();
  }

  async retriveSession(): Promise<RetriveSessionReturnValue> {
    return await this._client.getSession();
  }

  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>,
  ): AuthStateChangeReturnValue {
    return this._client.onAuthStateChange(callback);
  }
}
