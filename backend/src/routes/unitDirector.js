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
      // Get all offices with their program counts
      const { data: offices, error: officesError } = await supabase.from(
        "offices"
      ).select(`
        id,
        name,
        description,
        programs(count)
      `);

      if (officesError) throw officesError;

      // Transform the data to match expected format
      const officesWithCounts = offices.map((office) => ({
        ...office,
        program_count: office.programs.length,
      }));

      // Get total program statistics
      const { data: programs, error: statsError } = await supabase
        .from("programs")
        .select("status");

      if (statsError) throw statsError;

      const statistics = {
        total_programs: programs.length,
        ongoing_programs: programs.filter((p) => p.status === "ongoing").length,
        completed_programs: programs.filter((p) => p.status === "completed")
          .length,
        upcoming_programs: programs.filter((p) => p.status === "upcoming")
          .length,
      };

      res.json({
        offices: officesWithCounts,
        statistics,
      });
    } catch (error) {
      console.error("Unit director dashboard error:", error);
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
        items: []
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
        items: []
      };

      res.json(messages);
    } catch (error) {
      console.error("Unit director messages error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
