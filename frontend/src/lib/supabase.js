import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://hanrnoqvzkqwvotcexva.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJub3F2emtxd3ZvdGNleHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzIzMjAsImV4cCI6MjA3MjA0ODMyMH0.WaX7r0SfqmOwQAtrDcG1UBc_Pdyb_wqJgilkOmmEp38";

export const supabase = createClient(supabaseUrl, supabaseKey);
