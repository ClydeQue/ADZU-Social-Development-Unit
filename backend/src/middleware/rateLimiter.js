// Rate Limiter Middleware
// Protects against brute force attacks
const rateLimit = require("express-rate-limit");

// In-memory store for development (replace with Redis in production)
class MemoryStore {
  constructor() {
    this.hits = new Map();
    this.resetTime = new Map();
  }

  incr(key, cb) {
    const now = Date.now();
    const resetTime = this.resetTime.get(key);

    // Reset if time window has passed
    if (!resetTime || now > resetTime) {
      this.hits.set(key, 1);
      this.resetTime.set(key, now + 60000); // 1 minute window
      return cb(null, 1, now + 60000);
    }

    const hits = (this.hits.get(key) || 0) + 1;
    this.hits.set(key, hits);
    cb(null, hits, resetTime);
  }

  decrement(key) {
    const hits = this.hits.get(key) || 0;
    if (hits > 0) {
      this.hits.set(key, hits - 1);
    }
  }

  resetKey(key) {
    this.hits.delete(key);
    this.resetTime.delete(key);
  }
}

// Login rate limiter - 5 attempts per minute
const loginLimiter = rateLimit({
  store: new MemoryStore(),
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 attempts per window
  message: {
    error: "Too many login attempts",
    message: "Please wait 1 minute before trying again",
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator (IP + user agent for better tracking)
  keyGenerator: (req) => {
    return `login:${req.ip}:${req.get("User-Agent") || "unknown"}`;
  },
  // Skip successful requests (only count failed attempts)
  skipSuccessfulRequests: true,
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.log(`🚫 Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many login attempts",
      message: "Please wait 1 minute before trying again",
      retryAfter: 60,
      timestamp: new Date().toISOString(),
    });
  },
});

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests",
    message: "Please slow down and try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Anomaly detection middleware
const anomalyDetection = (req, res, next) => {
  const suspiciousPatterns = [
    // SQL injection patterns
    /(\bor\b|\band\b).*?[=<>]/i,
    /union.*select/i,
    /drop.*table/i,

    // XSS patterns
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,

    // Path traversal
    /\.\.\//,
    /etc\/passwd/,

    // Common attack patterns
    /eval\s*\(/i,
    /exec\s*\(/i,
  ];

  const userAgent = req.get("User-Agent") || "";
  const suspicious = suspiciousPatterns.some(
    (pattern) =>
      pattern.test(JSON.stringify(req.body)) ||
      pattern.test(req.url) ||
      pattern.test(userAgent)
  );

  if (suspicious) {
    console.log(`🚨 Suspicious activity detected from IP: ${req.ip}`);
    console.log(`URL: ${req.url}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`User-Agent: ${userAgent}`);

    return res.status(403).json({
      error: "Suspicious activity detected",
      message: "Request blocked for security reasons",
    });
  }

  next();
};

module.exports = {
  loginLimiter,
  apiLimiter,
  anomalyDetection,
  MemoryStore,
};
