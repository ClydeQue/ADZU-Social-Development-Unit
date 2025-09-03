const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// Get all offices (public route for office selection)
router.get("/all", async (req, res) => {
  try {
    const { data: offices, error } = await supabase
      .from("offices")
      .select("id, name, description")
      .order("name");

    if (error) throw error;

    res.json({ offices });
  } catch (error) {
    console.error("Get offices error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all offices with program counts (for admin)
router.get("/all-with-programs", authenticateToken, requireRole("unit_director"), async (req, res) => {
  try {
    const { data: offices, error } = await supabase
      .from("offices")
      .select(`
        id,
        name,
        description,
        programs(count)
      `)
      .order("name");

    if (error) throw error;

    const officesWithCounts = offices.map((office) => ({
      ...office,
      program_count: office.programs?.[0]?.count || 0,
    }));

    res.json({ offices: officesWithCounts });
  } catch (error) {
    console.error("Get offices with programs error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get specific office dashboard data
router.get("/:officeId/dashboard", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (req.user.userType !== "unit_director" && req.user.office_id != officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get office details
    const { data: office, error: officeError } = await supabase
      .from("offices")
      .select("id, name, description")
      .eq("id", officeId)
      .single();

    if (officeError) throw officeError;

    // Get office programs with statistics
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (programsError) throw programsError;

    // Calculate statistics
    const statistics = {
      total_programs: programs.length,
      ongoing_programs: programs.filter((p) => p.status === "ongoing").length,
      completed_programs: programs.filter((p) => p.status === "completed").length,
      upcoming_programs: programs.filter((p) => p.status === "upcoming").length,
    };

    res.json({
      office,
      programs,
      statistics,
    });
  } catch (error) {
    console.error("Get office dashboard error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get office programs
router.get("/:officeId/programs", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (req.user.userType !== "unit_director" && req.user.office_id != officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ programs });
  } catch (error) {
    console.error("Get office programs error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
