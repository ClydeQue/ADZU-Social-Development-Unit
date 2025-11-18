const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticateToken, requireRole } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

console.log("✅ Settings route loaded");

// Get all offices with their programs (for unit director settings)
router.get(
  "/",
  authenticateToken,
  requireRole(["unit_director"]),
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
          director: "",
          email: "",
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

// Change office account password (for unit director)
router.put(
  "/office/:officeId/change-password",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { officeId } = req.params;
      const { newPassword } = req.body;

      console.log("Change password request for office:", officeId);

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      // Check if office credentials exist
      const { data: existingCred, error: checkError } = await supabase
        .from("office_credentials")
        .select("id, office_id")
        .eq("office_id", officeId)
        .single();

      if (checkError) {
        console.error("Error checking credentials:", checkError);
        return res.status(404).json({
          error: "Office credentials not found",
          details: checkError.message,
        });
      }

      console.log("Found credentials:", existingCred);

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      console.log("Updating password hash for office:", officeId);

      // Update the office account password (column name is 'password' not 'password_hash')
      const { data: updateData, error: updateError } = await supabase
        .from("office_credentials")
        .update({ password: passwordHash })
        .eq("office_id", officeId)
        .select();

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Password updated successfully:", updateData);

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Change office password error:", error);
      res.status(500).json({
        error: "Error changing password",
        details: error.message,
      });
    }
  }
);

module.exports = router;
