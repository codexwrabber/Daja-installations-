import { createBrowserClient } from '@supabase/ssr';

// Intentionally untyped (no <Database> generic): the generic-typed client
// collapsed every query to `never` under some supabase-js/ssr version pairings.
// Row shapes are still typed via types/database.ts where results are used.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
 
