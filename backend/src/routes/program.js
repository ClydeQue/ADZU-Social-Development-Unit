const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// Create new program
router.post("/", authMiddleware, async (req, res) => {
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
    } = req.body;

    // Check if user has access to this office
    if (req.user.role !== "unit_director" && req.user.office_id != office_id) {
      return res.status(403).json({ error: "Access denied to this office" });
    }

    const { data: program, error } = await supabase
      .from("programs")
      .insert({
        title,
        description,
        status,
        funding_source,
        participants_count,
        start_date,
        end_date,
        office_id,
        created_by: req.user.id,
      })
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
router.put("/:id", authMiddleware, async (req, res) => {
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
      req.user.role !== "unit_director" &&
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
router.delete("/:id", authMiddleware, async (req, res) => {
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
      req.user.role !== "unit_director" &&
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
