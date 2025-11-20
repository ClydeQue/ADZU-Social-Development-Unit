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
      // Get all activities with their status (set by offices)
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("id, status");

      if (activitiesError) throw activitiesError;

      // Calculate statistics based on activity status
      // Status values: "completed", "in progress", "pending", etc.
      const statistics = {
        completed: activities.filter(
          (a) => a.status && a.status.toLowerCase() === "completed"
        ).length,
        in_progress: activities.filter(
          (a) =>
            a.status &&
            (a.status.toLowerCase() === "in progress" ||
              a.status.toLowerCase() === "ongoing" ||
              a.status.toLowerCase() === "in-progress")
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

// Get upcoming activities (next 3 closest to current date)
router.get(
  "/upcoming-activities",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = today.toISOString();

      // Query activities where end_date >= today (not ended yet)
      // Ordered by end_date to show activities due soonest first
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
        .order("end_date", { ascending: true })
        .limit(3);

      if (error) throw error;

      // Transform to frontend format
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
        .select(`
          *,
          programs(
            id, 
            title, 
            office_id,
            offices(id, name, acronym)
          )
        `)
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

module.exports = router;
