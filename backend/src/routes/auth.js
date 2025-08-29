const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/database");

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let tableName =
      role === "unit_director" ? "unit_directors" : "office_users";

    const { data: users, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) throw error;

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
        office_id: user.office_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
        office_id: user.office_id || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// Verify token route
router.get("/verify", async (req, res) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let tableName =
      decoded.role === "unit_director" ? "unit_directors" : "office_users";

    const { data: users, error } = await supabase
      .from(tableName)
      .select("id, email, name")
      .eq("id", decoded.id)
      .limit(1);

    if (error) throw error;

    if (users.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      user: {
        ...users[0],
        role: decoded.role,
        office_id: decoded.office_id,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
