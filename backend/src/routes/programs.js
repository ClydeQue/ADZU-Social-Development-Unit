const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const {
  authenticateToken,
  requireOfficeUser,
} = require("../middleware/auth");

// ========================================
// GET OFFICES (Replaces GET PROGRAMS)
// ========================================
router.get("/", authenticateToken, requireOfficeUser, async (req, res) => {
  try {
    const { office_id, userType } = req.user;

    // Base query: select all offices ordered by name
    let query = supabase
      .from("offices")
      .select("*")
      .order("office_name");

    // Office users only see THEIR office
    if (userType === "office_user") {
      query = query.eq("id", office_id);
    }

    const { data: offices, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: offices,
    });
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offices",
    });
  }
});

module.exports = router;
