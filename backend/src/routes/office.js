const express = require("express");
const { authMiddleware } = require("../middleware/auth");
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

// Get office dashboard data
router.get("/:officeId/dashboard", authMiddleware, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (req.user.role !== "unit_director" && req.user.office_id != officeId) {
      return res.status(403).json({ error: "Access denied to this office" });
    }

    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ programs });
  } catch (error) {
    console.error("Office dashboard error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
