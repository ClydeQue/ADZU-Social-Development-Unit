// Debug script to check what Unit Directors exist in your database
import { supabase } from "../lib/supabase.js";

const checkUnitDirectors = async () => {
  console.log("🔍 Checking unit_directors table...");

  try {
    const { data: directors, error } = await supabase
      .from("unit_directors")
      .select("*");

    if (error) {
      console.error("❌ Database error:", error);
      return;
    }

    console.log("📋 Unit Directors in database:", directors);

    if (directors && directors.length > 0) {
      directors.forEach((director) => {
        console.log(
          `👤 ${director.email} - ID: ${director.id} - Password: ${
            director.password?.startsWith("$2") ? "HASHED" : "PLAIN TEXT"
          }`
        );
      });
    } else {
      console.log("❌ No unit directors found in database");
    }
  } catch (err) {
    console.error("❌ Error checking unit directors:", err);
  }
};

// Run the check
checkUnitDirectors();
