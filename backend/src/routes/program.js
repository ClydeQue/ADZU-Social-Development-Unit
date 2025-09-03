const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// Get all programs (with optional filters)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const { status, office_id, year } = req.query;

    let query = supabase
      .from("programs")
      .select(
        `
        *,
        offices(name)
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (status) query = query.eq("status", status);
    if (office_id) query = query.eq("office_id", office_id);
    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte("start_date", startDate).lte("start_date", endDate);
    }

    const { data: programs, error } = await query;

    if (error) throw error;

    res.json({ programs });
  } catch (error) {
    console.error("Get all programs error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new program
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      funding_source,
      participants_count,
      start_date,
      end_date,
      office_id,
      target_participants,
      sdg_goals,
      adzu_goals,
    } = req.body;

    // Check if user has permission to create program for this office
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != office_id
    ) {
      return res.status(403).json({
        error: "Access denied. You can only create programs for your office.",
      });
    }

    const { data: program, error } = await supabase
      .from("programs")
      .insert([
        {
          title,
          description,
          target_participants,
          start_date,
          end_date,
          status,
          office_id,
          sdg_goals,
          adzu_goals,
          funding_source,
          participants_count,
          created_by: req.user.userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ program });
  } catch (error) {
    console.error("Create program error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update program
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      funding_source,
      participants_count,
      start_date,
      end_date,
      target_participants,
      sdg_goals,
      adzu_goals,
    } = req.body;

    // Check if program exists and user has access
    const { data: programs, error: checkError } = await supabase
      .from("programs")
      .select("office_id")
      .eq("id", id)
      .limit(1);

    if (checkError) throw checkError;

    if (programs.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const programOfficeId = programs[0].office_id;

    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != programOfficeId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data: program, error } = await supabase
      .from("programs")
      .update({
        title,
        description,
        status,
        funding_source,
        participants_count,
        start_date,
        end_date,
        target_participants,
        sdg_goals,
        adzu_goals,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ program });
  } catch (error) {
    console.error("Update program error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete program
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if program exists and user has access
    const { data: programs, error: checkError } = await supabase
      .from("programs")
      .select("office_id")
      .eq("id", id)
      .limit(1);

    if (checkError) throw checkError;

    if (programs.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const programOfficeId = programs[0].office_id;

    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != programOfficeId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { error } = await supabase.from("programs").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Delete program error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
