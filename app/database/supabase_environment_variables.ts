type ReturnValues = {
  SUPABASE_ANON_KEY: string;
  SUPABASE_URL: string;
};

export function getSupabaseEnvironmentVariables(): ReturnValues {
  const { env } = process;
  if (env.SUPABASE_ANON_KEY == null || env.SUPABASE_URL == null) {
    throw new Error('SUPABASE_ANON_KEY or SUPABASE_URL are not set. Please set environment variables.');
  }

  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env;

  return {
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
  };
}
