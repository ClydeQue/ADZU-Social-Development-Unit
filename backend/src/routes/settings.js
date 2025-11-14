const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticateToken } = require("../middleware/auth");

console.log("✅ Settings route loaded");

router.get("/", authenticateToken, async (req, res) => {
  console.log("=== GET /api/settings ===");
  console.log("User:", req.user?.id);
  
  try {
    console.log("Step 1: Querying offices table...");
    
    // Simple query - just get everything first
    const { data: offices, error } = await supabase
      .from("offices")
      .select("*");

    console.log("Step 2: Query completed");
    console.log("Error:", error);
    console.log("Data count:", offices?.length);

    if (error) {
      console.error("Supabase error:", JSON.stringify(error, null, 2));
      throw error;
    }

    console.log("Step 3: Mapping logos...");

    const logoMap = {
      'acca': '/images/acca_logo_small.webp',
      'aces': '/images/aces_logo_small.webp',
      'aclg': '/images/aclg_logo_small.webp',
      'altec': '/images/altec_logo_small.webp',
      'apc': '/images/apc_logo_small.webp',
      'apl': '/images/apl_logo_small.webp',
      'cces': '/images/cces_logo_small.webp'
    };

    const formattedOffices = offices.map((office) => {
      const acronymLower = office.acronym?.toLowerCase();
      return {
        id: office.id,
        name: office.name,
        acronym: office.acronym,
        description: office.description,
        logo: logoMap[acronymLower] || '/images/default_logo.webp',
        createdAt: office.created_at,
        updatedAt: office.updated_at,
      };
    });

    console.log("Step 4: Sending response with", formattedOffices.length, "offices");

    res.json({
      success: true,
      offices: formattedOffices,
    });
  } catch (error) {
    console.error("=== ERROR ===");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);
    
    res.status(500).json({
      error: "Error fetching offices",
      details: error.message,
      code: error.code,
    });
  }
});

module.exports = router;