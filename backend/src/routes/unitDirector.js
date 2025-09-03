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

// Get reports data
router.get(
  "/reports",
  authenticateToken,
  requireRole("unit_director"),
  async (req, res) => {
    try {
      const { month, year } = req.query;

      let query = supabase
        .from("programs")
        .select(
          `
        *,
        offices(name)
      `
        )
        .order("created_at", { ascending: false });

      if (month && year) {
        // Filter by month and year
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      }

      const { data: programs, error } = await query;

      if (error) throw error;

      // Transform the data to match expected format
      const transformedPrograms = programs.map((program) => ({
        ...program,
        office_name: program.offices?.name,
      }));

      res.json({ programs: transformedPrograms });
    } catch (error) {
      console.error("Unit director reports error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
