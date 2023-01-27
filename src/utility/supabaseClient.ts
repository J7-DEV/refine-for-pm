import { createClient } from "@pankod/refine-supabase";

export const SUPABASE_URL = "https://qslwybrlachntnykgqvc.supabase.co";
export const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbHd5YnJsYWNobnRueWtncXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM5ODY5OTYsImV4cCI6MTk4OTU2Mjk5Nn0.-eNMopp45fpeaZjS0K-Hcnh54N3ccw5ptAYq1z2LbrM";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * TODO
 * @ref https://supabase.com/docs/reference/javascript/admin-api
 * https://supabase.com/docs/reference/javascript/auth-admin-getuserbyid
 */
