const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(-1);
}

// Create Supabase client with service role key for server operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("offices")
      .select("count")
      .limit(1);
    if (error) throw error;
    console.log("Connected to Supabase database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(-1);
  }
};

testConnection();

module.exports = supabase;
