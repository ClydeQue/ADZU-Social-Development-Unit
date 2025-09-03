const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables:");
  console.error("SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "✅ Set" : "❌ Missing"
  );

  // Don't exit in serverless - just throw an error
  throw new Error("Missing required Supabase environment variables");
}

// Create Supabase client with service role key for server operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test database connection (only in development)
const testConnection = async () => {
  // Skip database test in serverless environment
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping database connection test in production");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("offices")
      .select("count")
      .limit(1);
    if (error) throw error;
    console.log("Connected to Supabase database");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Only test connection in development
if (process.env.NODE_ENV !== "production") {
  testConnection();
}

module.exports = supabase;
