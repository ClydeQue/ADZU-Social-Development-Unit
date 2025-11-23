const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// Get unit director dashboard data
router.get(
  "/dashboard",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      // Get all activities with their status and phase
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("id, status, phase");

      if (activitiesError) throw activitiesError;

      // Calculate statistics
      // - completed: based on status
      // - in_progress: based on phase column (Implementation/Execution phase)
      // - pending: based on status
      const statistics = {
        completed: activities.filter(
          (a) => a.status && a.status.toLowerCase() === "completed"
        ).length,
        in_progress: activities.filter(
          (a) =>
            a.phase &&
            (a.phase.toLowerCase() === "in progress" ||
              a.phase.toLowerCase() === "implementation" ||
              a.phase.toLowerCase() === "execution")
        ).length,
        pending: activities.filter(
          (a) =>
            a.status &&
            (a.status.toLowerCase() === "pending" ||
              a.status.toLowerCase() === "planned")
        ).length,
      };

      res.json({
        statistics,
      });
    } catch (error) {
      console.error("Unit director dashboard error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get SDG distribution by office
router.get(
  "/sdg-analytics",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      // Get all activities with their SDG numbers and office info
      const { data: activities, error } = await supabase
        .from("activities")
        .select(
          `
          id,
          sdg_number,
          programs(
            id,
            offices(id, name, acronym)
          )
        `
        );

      if (error) throw error;

      // Initialize SDG data structure (SDG 1-17)
      const sdgData = [];
      for (let i = 1; i <= 17; i++) {
        sdgData.push({
          id: i,
          value: 0,
          offices: {
            ACCA: 0,
            ACES: 0,
            ACLG: 0,
            ALTEC: 0,
            APC: 0,
            CCES: 0,
          },
        });
      }

      // Process each activity
      activities.forEach((activity) => {
        if (activity.sdg_number && activity.programs?.offices?.acronym) {
          const officeAcronym = activity.programs.offices.acronym;

          try {
            // Parse SDG numbers (stored as JSON array)
            const sdgNumbers =
              typeof activity.sdg_number === "string"
                ? JSON.parse(activity.sdg_number)
                : Array.isArray(activity.sdg_number)
                ? activity.sdg_number
                : [activity.sdg_number];

            sdgNumbers.forEach((sdgNum) => {
              const sdg = parseInt(sdgNum);
              if (!isNaN(sdg) && sdg >= 1 && sdg <= 17) {
                // Increment total count for this SDG
                sdgData[sdg - 1].value++;
                // Increment office-specific count for this SDG
                if (sdgData[sdg - 1].offices[officeAcronym] !== undefined) {
                  sdgData[sdg - 1].offices[officeAcronym]++;
                }
              }
            });
          } catch (e) {
            console.error("Error parsing SDG numbers:", e);
            // Fallback for single numeric value
            const sdg = parseInt(activity.sdg_number);
            if (!isNaN(sdg) && sdg >= 1 && sdg <= 17) {
              sdgData[sdg - 1].value++;
              if (sdgData[sdg - 1].offices[officeAcronym] !== undefined) {
                sdgData[sdg - 1].offices[officeAcronym]++;
              }
            }
          }
        }
      });

      res.json({ sdgData });
    } catch (error) {
      console.error("Unit director SDG analytics error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get upcoming activities (all pending activities sorted by due date)
router.get(
  "/upcoming-activities",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = today.toISOString();

      // Query all activities from all offices where end_date >= today (not ended yet)
      // Ordered by end_date ascending to show activities due soonest first
      const { data: activities, error } = await supabase
        .from("activities")
        .select(
          `
          id,
          activity_name,
          start_date,
          end_date,
          status,
          programs(
            id,
            title,
            offices(id, name, acronym)
          )
        `
        )
        .gte("end_date", currentDate)
        .order("end_date", { ascending: true });

      if (error) throw error;

      // Transform all activities to frontend format (no status filtering)
      const upcomingActivities = activities.map((activity) => ({
        id: activity.id,
        office: activity.programs?.offices?.acronym || "N/A",
        activity: activity.activity_name || "Untitled Activity",
        due: activity.end_date,
        start_date: activity.start_date,
        status: activity.status || "pending",
        office_name: activity.programs?.offices?.name || "Unknown Office",
      }));

      res.json({ upcoming: upcomingActivities });
    } catch (error) {
      console.error("Unit director upcoming activities error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get reports data - Returns ACTIVITIES (not programs)
router.get(
  "/reports",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { month, year } = req.query;

      // Query activities with their programs and offices
      let query = supabase
        .from("activities")
        .select(
          `
        *,
        programs(
          id,
          title,
          description,
          offices(id, name, acronym)
        )
      `
        )
        .order("start_date", { ascending: false });

      // Filter by month and year if provided
      if (month && year) {
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
        query = query.gte("start_date", startDate).lte("start_date", endDate);
      }

      const { data: activities, error } = await query;

      if (error) throw error;

      // Transform the data to include program and office info at root level
      const transformedActivities = activities.map((activity) => ({
        ...activity,
        program_id: activity.programs?.id,
        program_title: activity.programs?.title || "Untitled Program",
        program_description: activity.programs?.description,
        office_id: activity.programs?.offices?.id,
        office_name: activity.programs?.offices?.name || "Unknown Office",
        office_acronym: activity.programs?.offices?.acronym || "N/A",
      }));

      res.json({ activities: transformedActivities });
    } catch (error) {
      console.error("Unit director reports error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get user profile data
router.get(
  "/profile",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const { data: user, error } = await supabase
        .from("office_credentials")
        .select("id, name, email, created_at, user_type")
        .eq("id", userId)
        .eq("user_type", "unit_director")
        .single();

      if (error) throw error;

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Unit director profile error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get notifications
router.get(
  "/notifications",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // For now, return mock data until we have a notifications table
      // You can create a notifications table later
      const notifications = {
        unread: 0,
        items: [],
      };

      res.json(notifications);
    } catch (error) {
      console.error("Unit director notifications error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get messages/emails
router.get(
  "/messages",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // For now, return mock data until we have a messages table
      // You can create a messages table later
      const messages = {
        unread: 0,
        items: [],
      };

      res.json(messages);
    } catch (error) {
      console.error("Unit director messages error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get all activities for calendar view
router.get(
  "/activities",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      // Query all activities with their programs and offices
      const { data: activities, error } = await supabase
        .from("activities")
        .select(
          `
          id,
          activity_name,
          start_date,
          end_date,
          status,
          venue,
          participants_count,
          objectives,
          notes,
          programs(
            id,
            title,
            offices(
              id,
              name,
              acronym
            )
          )
        `
        )
        .order("start_date", { ascending: true });

      if (error) throw error;

      // Transform to include office info at root level
      const transformedActivities = activities.map((activity) => ({
        id: activity.id,
        title: activity.activity_name,
        start: activity.start_date,
        end: activity.end_date,
        status: activity.status || "pending",
        venue: activity.venue,
        participants_count: activity.participants_count,
        objectives: activity.objectives,
        notes: activity.notes,
        program_id: activity.programs?.id,
        program_title: activity.programs?.title || "Untitled Program",
        office_id: activity.programs?.offices?.id,
        office_name: activity.programs?.offices?.name || "Unknown",
        office_acronym: activity.programs?.offices?.acronym || "N/A",
      }));

      res.json({ activities: transformedActivities });
    } catch (error) {
      console.error("Unit director activities error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get all offices (for Unit Director Settings)
router.get(
  "/offices",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      // Fetch all offices from your Supabase "offices" table
      const { data: offices, error } = await supabase
        .from("offices")
        .select("id, acronym, name, director, email")
        .order("acronym", { ascending: true });

      if (error) throw error;

      res.json({ offices });
    } catch (error) {
      console.error("Unit director offices error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get single activity by ID (for Unit Director to view any activity)
router.get(
  "/activities/:activityId",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { activityId } = req.params;

      const { data: activity, error } = await supabase
        .from("activities")
        .select(
          `
          *,
          programs(
            id, 
            title, 
            office_id,
            offices(id, name, acronym)
          )
        `
        )
        .eq("id", activityId)
        .single();

      if (error) {
        console.error("Get activity query error:", error);
        throw error;
      }

      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }

      res.json({ activity });
    } catch (error) {
      console.error("Unit director get activity error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Update activity status (Unit Director only)
router.put(
  "/activities/:activityId/status",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { activityId } = req.params;
      const { status } = req.body;

      // Validate status value
      const validStatuses = [
        "pending",
        "in-progress",
        "completed",
        "cancelled",
      ];
      if (!status || !validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          error:
            "Invalid status. Must be one of: pending, in-progress, completed, cancelled",
        });
      }

      // Update the activity status
      const { data: updatedActivity, error } = await supabase
        .from("activities")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activityId)
        .select(
          `
          *,
          programs(
            id, 
            title, 
            office_id,
            offices(id, name, acronym)
          )
        `
        )
        .single();

      if (error) {
        console.error("Update status error:", error);
        throw error;
      }

      if (!updatedActivity) {
        return res.status(404).json({ error: "Activity not found" });
      }

      res.json({
        message: "Activity status updated successfully",
        activity: updatedActivity,
      });
    } catch (error) {
      console.error("Unit director update status error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ========================================
// USER MANAGEMENT ENDPOINTS
// ========================================

/**
 * Helper function to determine if a user is logged in
 * A user is considered logged in (active) if:
 * - is_active flag is true (set on login, cleared on logout)
 *
 * @param {Object} user - User object with is_active and last_login fields
 * @returns {boolean} - true if logged in, false if inactive
 */
function isUserLoggedIn(user) {
  // Check if is_active flag is true
  return user.is_active === true;
}

// Get all office users (for User Management page)
router.get(
  "/users",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      // First, fetch all office_user credentials
      const { data: credentials, error: credError } = await supabase
        .from("office_credentials")
        .select(
          "id, username, name, user_type, is_active, last_login, created_at, office_id"
        )
        .eq("user_type", "office_user")
        .order("created_at", { ascending: false });

      if (credError) throw credError;

      console.log(
        "Raw credentials from DB:",
        credentials.map((c) => ({
          username: c.username,
          is_active: c.is_active,
          is_active_type: typeof c.is_active,
        }))
      );

      // Fetch all offices
      const { data: offices, error: officeError } = await supabase
        .from("offices")
        .select("id, name, acronym");

      if (officeError) throw officeError;

      // Create a map of office_id to office data for quick lookup
      const officeMap = {};
      offices.forEach((office) => {
        officeMap[office.id] = office;
      });

      // Format response by joining credentials with offices
      const formattedUsers = credentials.map((user) => {
        const office = officeMap[user.office_id] || {};
        const loggedIn = isUserLoggedIn(user);

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          office: office.acronym || "N/A",
          officeName: office.name || "N/A",
          officeId: user.office_id,
          isActive: loggedIn, // true if logged in, false if inactive
          status: loggedIn ? "active" : "inactive", // Status string for display
          lastLogin: user.last_login,
          lastPasswordUpdate: user.created_at, // Use created_at as fallback
          createdAt: user.created_at,
        };
      });

      console.log(`Found ${formattedUsers.length} office users`);
      console.log("Sample user data:", formattedUsers[0]);

      res.json({ success: true, users: formattedUsers });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        error: "Server error",
        details: error.message,
      });
    }
  }
);

// Change user username
router.put(
  "/users/:userId/username",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { newUsername } = req.body;

      console.log("Change username request:", { userId, newUsername });

      if (!newUsername || newUsername.trim().length < 3) {
        return res.status(400).json({
          error: "Username must be at least 3 characters",
        });
      }

      // Check if username already exists
      const { data: existing, error: checkError } = await supabase
        .from("office_credentials")
        .select("id")
        .eq("username", newUsername.trim().toLowerCase())
        .neq("id", userId)
        .single();

      if (existing) {
        return res.status(400).json({
          error: "Username already exists",
        });
      }

      // Update username
      const { data: updatedUser, error: updateError } = await supabase
        .from("office_credentials")
        .update({ username: newUsername.trim().toLowerCase() })
        .eq("id", userId)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log("Username updated successfully:", updatedUser);

      res.json({
        success: true,
        message: "Username updated successfully",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
        },
      });
    } catch (error) {
      console.error("Change username error:", error);
      res.status(500).json({
        error: "Error changing username",
        details: error.message,
      });
    }
  }
);

// Change user password
router.put(
  "/users/:userId/password",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      console.log("Change password request for user:", userId);

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      // Hash the new password
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // Update password
      const { data: updatedUser, error: updateError } = await supabase
        .from("office_credentials")
        .update({ password: passwordHash })
        .eq("id", userId)
        .select("id, username")
        .single();

      if (updateError) throw updateError;

      console.log(
        "Password updated successfully for user:",
        updatedUser.username
      );

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        error: "Error changing password",
        details: error.message,
      });
    }
  }
);

// ========================================
// PASSWORD RESET REQUEST MANAGEMENT
// ========================================

// Get all password reset requests (pending)
router.get(
  "/password-reset-requests",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      console.log("Fetching password reset requests");

      // Query all pending password reset requests with office information
      const { data: requests, error } = await supabase
        .from("password_reset_requests")
        .select(
          `
          id,
          username,
          office_id,
          status,
          created_at,
          updated_at,
          offices(
            id,
            name,
            acronym
          )
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reset requests:", error);
        throw error;
      }

      // Transform data to match frontend expectations
      const formattedRequests = requests.map((request) => ({
        id: request.id,
        username: request.username,
        office: request.offices?.acronym || "N/A",
        officeName: request.offices?.name || "Unknown Office",
        requestDate: request.created_at,
        status: request.status,
      }));

      console.log(`Found ${formattedRequests.length} pending reset requests`);

      res.json({
        success: true,
        requests: formattedRequests,
      });
    } catch (error) {
      console.error("Get password reset requests error:", error);
      res.status(500).json({
        success: false,
        error: "Error fetching password reset requests",
        details: error.message,
      });
    }
  }
);

// Approve password reset request (reset password to "password123")
router.post(
  "/password-reset-requests/:id/approve",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log("Approving password reset request:", id);

      // Get the reset request
      const { data: request, error: fetchError } = await supabase
        .from("password_reset_requests")
        .select("id, username, status")
        .eq("id", id)
        .single();

      if (fetchError || !request) {
        console.error("Reset request not found:", id);
        return res.status(404).json({
          success: false,
          error: "Reset request not found",
        });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          error: "Reset request is not pending",
        });
      }

      // Hash the default password "password123"
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash("password123", salt);

      console.log("Resetting password for user:", request.username);

      // Update the user's password in office_credentials
      const { error: updatePasswordError } = await supabase
        .from("office_credentials")
        .update({ password: passwordHash })
        .eq("username", request.username);

      if (updatePasswordError) {
        console.error("Error updating password:", updatePasswordError);
        throw updatePasswordError;
      }

      // Update the reset request status to "approved"
      const { error: updateRequestError } = await supabase
        .from("password_reset_requests")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateRequestError) {
        console.error("Error updating request status:", updateRequestError);
        throw updateRequestError;
      }

      console.log("Password reset approved for:", request.username);

      res.json({
        success: true,
        message: "Password reset approved. Password has been reset to password123",
      });
    } catch (error) {
      console.error("Approve password reset error:", error);
      res.status(500).json({
        success: false,
        error: "Error approving password reset",
        details: error.message,
      });
    }
  }
);

// Reject password reset request
router.post(
  "/password-reset-requests/:id/reject",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log("Rejecting password reset request:", id);

      // Get the reset request
      const { data: request, error: fetchError } = await supabase
        .from("password_reset_requests")
        .select("id, username, status")
        .eq("id", id)
        .single();

      if (fetchError || !request) {
        console.error("Reset request not found:", id);
        return res.status(404).json({
          success: false,
          error: "Reset request not found",
        });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          error: "Reset request is not pending",
        });
      }

      // Update the reset request status to "rejected"
      const { error: updateError } = await supabase
        .from("password_reset_requests")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating request status:", updateError);
        throw updateError;
      }

      console.log("Password reset rejected for:", request.username);

      res.json({
        success: true,
        message: "Password reset request rejected",
      });
    } catch (error) {
      console.error("Reject password reset error:", error);
      res.status(500).json({
        success: false,
        error: "Error rejecting password reset",
        details: error.message,
      });
    }
  }
);

module.exports = router;
