const express = require("express");
const supabase = require("../config/database");
const bcryptjs = require("bcryptjs");

const router = express.Router();

// Debug endpoint to check unit directors
router.get("/unit-directors", async (req, res) => {
  try {
    const { data: directors, error } = await supabase
      .from("unit_directors")
      .select("id, name, email")
      .limit(5);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      directors: directors || [],
      count: directors?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check office users
router.get("/office-users", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("office_users")
      .select("id, name, email, office_id")
      .limit(5);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      users: users || [],
      count: users?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check password format
router.post("/check-password", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const tableName =
      userType === "unit_director" ? "unit_directors" : "office_users";

    const { data: users, error } = await supabase
      .from(tableName)
      .select("id, email, password")
      .eq("email", email.trim().toLowerCase())
      .limit(1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!users || users.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
        email: email,
      });
    }

    const user = users[0];
    const storedPassword = user.password;

    // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    const isHashed = /^\$2[aby]\$/.test(storedPassword);

    let passwordMatch = false;
    if (isHashed) {
      // Try bcrypt comparison
      passwordMatch = await bcryptjs.compare(password, storedPassword);
    } else {
      // Try plain text comparison
      passwordMatch = password === storedPassword;
    }

    res.json({
      success: true,
      email: email,
      passwordMatch,
      passwordIsHashed: isHashed,
      storedPasswordStart: storedPassword.substring(0, 10) + "...",
      message: passwordMatch ? "Password matches!" : "Password does not match",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
