const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables:");
  console.error("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "Set" : "Missing"
  );

  // Don't exit in serverless - just throw an error
  throw new Error(
    `Missing required Supabase environment variables. Please ensure your .env file contains valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values. Current values: URL=${!!supabaseUrl}, KEY=${!!supabaseServiceKey}`
  );
}

// Test the database connection immediately
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Database connection test failed:", error);
      throw error;
    }

    console.log("Successfully connected to Supabase database");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Create Supabase client with service role key for server operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test database connection on startup
const validateDatabaseConnection = async () => {
  // Skip in production
  if (process.env.NODE_ENV === "production") {
    console.log("Skipping database connection test in production");
    return;
  }

  try {
    console.log("Testing database connection...");

    // Test activities table
    const activitiesTest = await supabase
      .from("activities")
      .select("count")
      .limit(1);

    if (activitiesTest.error) {
      throw new Error(
        `Activities table error: ${activitiesTest.error.message}`
      );
    }

    // Test notifications table
    const notificationsTest = await supabase
      .from("notifications")
      .select("count")
      .limit(1);

    if (notificationsTest.error) {
      throw new Error(
        `Notifications table error: ${notificationsTest.error.message}`
      );
    }

    console.log("Successfully connected to Supabase database");
    console.log("Verified access to activities and notifications tables");
  } catch (error) {
    console.error("Database connection/validation error:", error);
    // Don't throw here - let the application continue but log the error
  }
};

// Run validation in development
if (process.env.NODE_ENV !== "production") {
  validateDatabaseConnection();
}

module.exports = supabase;
