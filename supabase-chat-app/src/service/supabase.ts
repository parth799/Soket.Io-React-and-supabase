import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

const supabaseOptions: SupabaseClientOptions = {
  autoRefreshToken: true,
  persistSession: true,
  // detectSessionInUrl: true,
};

const supabaseClient = createClient(
"https://zqnwwqdempjogmvjrxyu.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbnd3cWRlbXBqb2dtdmpyeHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyMjUyODQsImV4cCI6MjAzODgwMTI4NH0.-sae6dPYJmqXp_Hy4WHevnfso3-pny4IfkzMdiHJ8ZE",
  supabaseOptions
);

export { supabaseClient };
