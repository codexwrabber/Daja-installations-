import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// SERVER-ONLY. This uses the service-role key, which bypasses Row Level
// Security entirely. Never import this file from a Client Component or
// expose SUPABASE_SERVICE_ROLE_KEY with the NEXT_PUBLIC_ prefix.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
