import { createBrowserClient } from '@supabase/ssr';

// Use createBrowserClient instead of createClient so it automatically 
// sets up the secure PKCE flow and cookie handling for Next.js!
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);