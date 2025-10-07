const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const {
  authenticateToken,
  requireOfficeAccess,
  requireOfficeUser,
} = require("../middleware/auth");

// ========================================
// GET PROGRAMS FOR OFFICE
// ========================================
router.get("/", authenticateToken, requireOfficeUser, async (req, res) => {
  try {
    const { office_id } = req.user;

    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .eq("office_id", office_id)
      .order("title");

    if (error) throw error;

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
    });
  }
});

// ========================================
// GET ACTIVITIES FOR A PROGRAM
// ========================================
router.get("/:programId/activities", authenticateToken, async (req, res) => {
  try {
    const { programId } = req.params;
    const { office_id, userType } = req.user;

    // Verify program belongs to user's office (unless unit director)
    if (userType === "office_user") {
      const { data: program } = await supabase
        .from("programs")
        .select("office_id")
        .eq("id", programId)
        .single();

      if (!program || program.office_id !== office_id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    const { data: activities, error } = await supabase
      .from("activities")
      .select("*")
      .eq("program_id", programId)
      .order("start_date", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
});

// ========================================
// CREATE ACTIVITY
// ========================================
router.post(
  "/:programId/activities",
  authenticateToken,
  requireOfficeUser,
  async (req, res) => {
    try {
      const { programId } = req.params;
      const { office_id, userId } = req.user;
      const {
        activity_name,
        start_date,
        end_date,
        implementing_partners,
        objectives,
        participants_count,
        venue,
        budget,
        sdg_number,
        status,
        notes,
      } = req.body;

      // Verify program belongs to user's office
      const { data: program } = await supabase
        .from("programs")
        .select("office_id")
        .eq("id", programId)
        .single();

      if (!program || program.office_id !== office_id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const { data: activity, error } = await supabase
        .from("activities")
        .insert({
          program_id: programId,
          activity_name,
          start_date,
          end_date,
          implementing_partners,
          objectives,
          participants_count: participants_count || 0,
          venue,
          budget,
          sdg_number,
          status: status || "planned",
          notes,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: "Activity created successfully",
        data: activity,
      });
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create activity",
      });
    }
  }
);

// ========================================
// UPDATE ACTIVITY
// ========================================
router.put(
  "/:programId/activities/:activityId",
  authenticateToken,
  requireOfficeUser,
  async (req, res) => {
    try {
      const { programId, activityId } = req.params;
      const { office_id } = req.user;
      const updateData = req.body;

      // Verify program belongs to user's office
      const { data: program } = await supabase
        .from("programs")
        .select("office_id")
        .eq("id", programId)
        .single();

      if (!program || program.office_id !== office_id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const { data: activity, error } = await supabase
        .from("activities")
        .update(updateData)
        .eq("id", activityId)
        .eq("program_id", programId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: "Activity updated successfully",
        data: activity,
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update activity",
      });
    }
  }
);

// ========================================
// DELETE ACTIVITY
// ========================================
router.delete(
  "/:programId/activities/:activityId",
  authenticateToken,
  requireOfficeUser,
  async (req, res) => {
    try {
      const { programId, activityId } = req.params;
      const { office_id } = req.user;

      // Verify program belongs to user's office
      const { data: program } = await supabase
        .from("programs")
        .select("office_id")
        .eq("id", programId)
        .single();

      if (!program || program.office_id !== office_id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activityId)
        .eq("program_id", programId);

      if (error) throw error;

      res.json({
        success: true,
        message: "Activity deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete activity",
      });
    }
  }
);

module.exports = router;
