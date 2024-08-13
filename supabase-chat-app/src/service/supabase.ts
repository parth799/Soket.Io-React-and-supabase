import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

const supabaseOptions: SupabaseClientOptions = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabaseClient = createClient(
"SUPABSE_URL",
"SUPABSE_KEY",
  supabaseOptions
);

export { supabaseClient };
