const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables with explicit path
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Import routes
const authRoutes = require("./routes/auth");
const unitDirectorRoutes = require("./routes/unitDirector");
const officeRoutes = require("./routes/office");
const programRoutes = require("./routes/program");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    // In production, check against allowed origins
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      "https://localhost:3000",
      "https://localhost:5173",
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/unit-director", unitDirectorRoutes);
app.use("/api/office", officeRoutes);
app.use("/api/program", programRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AdZU SDU API Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// For Vercel deployment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`AdZU SDU API Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
