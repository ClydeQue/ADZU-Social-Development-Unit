const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("./routes/auth"); //JWT authentication
const unitDirectorRoutes = require("./routes/unitDirector");
const officeRoutes = require("./routes/office");
const programRoutes = require("./routes/program");
const programsRoutes = require("./routes/programs"); // Programs & Activities routes
const notificationRoutes = require("./routes/notifications");

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://localhost:3000",
        ],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        fontSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting - for production to prevent abuse on authentication endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for general endpoints
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// CORS configuration - allow both development and production origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://ateneo-sdu.vercel.app",
      "http://localhost:5173",
    ];
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes); // Professional JWT authentication
app.use("/api/unit-director", unitDirectorRoutes);
app.use("/api/office", officeRoutes);
app.use("/api/program", programRoutes);
app.use("/api/programs", programsRoutes); // Programs & Activities API
app.use("/api/notifications", notificationRoutes); // Notifications API

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "AdZU SDU API Server is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AdZU SDU API Server is running",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : "Internal Server Error",
    ...(isDevelopment && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5001;

// For local development only - Vercel handles this in production
if (process.env.NODE_ENV !== "production") {
  const server = app.listen(PORT, () => {
    console.log(`🚀 AdZU SDU API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });

  // Graceful shutdown for local development
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  });

  // Test database connection for local development
  setTimeout(testDatabaseConnection, 1000);
}

// Database connection check
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

// Test database connection function
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("office_credentials")
      .select("count", { count: "exact", head: true });

    if (error) throw error;

    console.log("✅ Connected to Supabase database");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
}

// Export for Vercel serverless functions
module.exports = app;
