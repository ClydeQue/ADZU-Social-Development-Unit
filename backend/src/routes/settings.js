const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticateToken, requireRole } = require("../middleware/auth");

console.log("✅ Settings route loaded");

// Get all offices with their programs (for unit director settings)
router.get(
  "/",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { data: offices, error } = await supabase
        .from("offices")
        .select(
          `
        id,
        name,
        acronym,
        description,
        director,
        email,
        created_at,
        updated_at,
        programs(
          id,
          title,
          description,
          is_fixed,
          office_id,
          created_at,
          updated_at
        )
      `
        )
        .order("name");

      if (error) throw error;

      const logoMap = {
        acca: "/images/acca_logo_small.webp",
        aces: "/images/aces_logo_small.webp",
        aclg: "/images/aclg_logo_small.webp",
        altec: "/images/altec_logo_small.webp",
        apc: "/images/apc_logo_small.webp",
        apl: "/images/apl_logo_small.webp",
        cces: "/images/cces_logo_small.webp",
      };

      const formattedOffices = offices.map((office) => {
        const acronymLower = office.acronym?.toLowerCase();

        return {
          id: office.id,
          name: office.name,
          acronym: office.acronym,
          description: office.description,
          director: office.director || "",
          email: office.email || "",
          logo: logoMap[acronymLower] || "/images/default_logo.webp",
          programs: office.programs || [],
          createdAt: office.created_at,
          updatedAt: office.updated_at,
        };
      });

      res.json({
        success: true,
        offices: formattedOffices,
      });
    } catch (error) {
      console.error("Get offices with programs error:", error);
      res.status(500).json({
        error: "Error fetching offices",
        details: error.message,
      });
    }
  }
);

module.exports = router;
