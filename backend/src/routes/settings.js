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

      console.log(`✅ GET /api/settings - Returning ${formattedOffices.length} offices`);
      formattedOffices.forEach(office => {
        console.log(`  - ${office.acronym}: ${office.programs?.length || 0} programs`);
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

// Change Unit Director username
router.put(
  "/unit-director/change-username",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { newUsername, currentPassword } = req.body;
      const userId = req.user.userId; // From JWT token

      console.log("Change username request for Unit Director:", userId);

      // Validation
      if (!newUsername || !currentPassword) {
        return res.status(400).json({
          success: false,
          error: "New username and current password are required",
        });
      }

      if (newUsername.length < 3) {
        return res.status(400).json({
          success: false,
          error: "Username must be at least 3 characters",
        });
      }

      // Get current user credentials
      const { data: user, error: fetchError } = await supabase
        .from("office_credentials")
        .select("id, username, password, user_type")
        .eq("id", userId)
        .eq("user_type", "unit_director")
        .single();

      if (fetchError || !user) {
        console.error("Error fetching user:", fetchError);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        console.log("Invalid current password for:", user.username);
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      // Check if new username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("office_credentials")
        .select("id")
        .eq("username", newUsername.trim().toLowerCase())
        .neq("id", userId)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Username already exists",
        });
      }

      console.log(
        "Updating username for Unit Director:",
        user.username,
        "->",
        newUsername
      );

      // Update username
      const { error: updateError } = await supabase
        .from("office_credentials")
        .update({ username: newUsername.trim().toLowerCase() })
        .eq("id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Username updated successfully");

      res.json({
        success: true,
        message: "Username updated successfully",
      });
    } catch (error) {
      console.error("Change Unit Director username error:", error);
      res.status(500).json({
        success: false,
        error: "Error changing username",
        details: error.message,
      });
    }
  }
);

// Change Unit Director password
router.put(
  "/unit-director/change-password",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId; // From JWT token

      console.log("Change password request for Unit Director:", userId);

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 6 characters",
        });
      }

      // Get current user credentials
      const { data: user, error: fetchError } = await supabase
        .from("office_credentials")
        .select("id, email, password, user_type")
        .eq("id", userId)
        .eq("user_type", "unit_director")
        .single();

      if (fetchError || !user) {
        console.error("Error fetching user:", fetchError);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        console.log("Invalid current password for:", user.email);
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      console.log("Updating password for Unit Director:", user.email);

      // Update password
      const { error: updateError } = await supabase
        .from("office_credentials")
        .update({ password: passwordHash })
        .eq("id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Password updated successfully for:", user.email);

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Change Unit Director password error:", error);
      res.status(500).json({
        success: false,
        error: "Error changing password",
        details: error.message,
      });
    }
  }
);

// Add program to office
router.post(
  "/office/:officeId/program",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { officeId } = req.params;
      const { title, description } = req.body;

      console.log("Add program request for office:", officeId);

      // Validation
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Program title is required",
        });
      }

      // Insert program
      const { data: newProgram, error: insertError } = await supabase
        .from("programs")
        .insert({
          office_id: officeId,
          title: title.trim(),
          description: description?.trim() || null,
          is_fixed: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Program added successfully:", newProgram);

      res.json({
        success: true,
        message: "Program added successfully",
        program: newProgram,
      });
    } catch (error) {
      console.error("Add program error:", error);
      res.status(500).json({
        success: false,
        error: "Error adding program",
        details: error.message,
      });
    }
  }
);

// Delete program
router.delete(
  "/program/:programId",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { programId } = req.params;

      console.log("Delete program request for program:", programId);

      // Check if program exists and get its details
      const { data: program, error: fetchError } = await supabase
        .from("programs")
        .select("id, is_fixed")
        .eq("id", programId)
        .single();

      if (fetchError || !program) {
        console.error("Program not found:", fetchError);
        return res.status(404).json({
          success: false,
          error: "Program not found",
        });
      }

      // Prevent deletion of fixed programs
      if (program.is_fixed) {
        return res.status(400).json({
          success: false,
          error: "Cannot delete fixed programs",
        });
      }

      // Delete program
      const { error: deleteError } = await supabase
        .from("programs")
        .delete()
        .eq("id", programId);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

      console.log("Program deleted successfully:", programId);

      res.json({
        success: true,
        message: "Program deleted successfully",
      });
    } catch (error) {
      console.error("Delete program error:", error);
      res.status(500).json({
        success: false,
        error: "Error deleting program",
        details: error.message,
      });
    }
  }
);

module.exports = router;
