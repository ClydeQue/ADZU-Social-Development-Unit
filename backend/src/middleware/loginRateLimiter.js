/**
 * Login Rate Limiter Middleware
 * Prevents brute force attacks by limiting login attempts
 * 
 * Rules:
 * - Max 1 request per 2 seconds (prevents spam)
 * - 5 failed attempts → 1 minute lockout
 * - Successful login → reset attempts
 */

const loginAttempts = new Map(); // Store: username -> { attempts, lockedUntil, lastRequestTime }

const MAX_ATTEMPTS = 10; // Increased from 5
const LOCKOUT_DURATION = 1 * 60 * 1000; // 1 minute
const REQUEST_DELAY = 500; // 0.5 seconds between requests (reduced from 1s)

/**
 * Middleware to check login rate limit
 */
const checkLoginRateLimit = (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next();
  }

  const normalizedUsername = username.trim().toLowerCase();
  const now = Date.now();
  
  // Get or create record
  let record = loginAttempts.get(normalizedUsername);
  let isNewUser = false;
  
  if (!record) {
    isNewUser = true;
    record = {
      attempts: 0,
      lockedUntil: null,
      lastRequestTime: now
    };
    loginAttempts.set(normalizedUsername, record);
  }
  
  // 1. FIRST Check if account is locked out (highest priority)
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    console.log(`Account locked: ${normalizedUsername} - ${remainingSeconds}s remaining`);
    return res.status(429).json({
      success: false,
      message: `Account locked. Please try again in ${remainingSeconds} seconds.`,
      locked: true,
      remainingSeconds
    });
  }
  
  // Reset if lockout expired
  if (record.lockedUntil && now >= record.lockedUntil) {
    record.attempts = 0;
    record.lockedUntil = null;
    loginAttempts.set(normalizedUsername, record);
  }
  
  // 2. THEN Check throttling - only if not locked out AND not a new user
  if (!isNewUser) {
    const timeSinceLastRequest = now - record.lastRequestTime;
    if (timeSinceLastRequest < REQUEST_DELAY) {
      const waitSeconds = Math.ceil((REQUEST_DELAY - timeSinceLastRequest) / 1000);
      console.log(`Too fast! ${normalizedUsername} needs to wait ${waitSeconds}s`);
      return res.status(429).json({
        success: false,
        message: `Too fast! Please wait ${waitSeconds} second${waitSeconds > 1 ? 's' : ''} before trying again.`,
        throttled: true,
        waitSeconds
      });
    }
  }
  
  // Update last request time
  record.lastRequestTime = now;
  loginAttempts.set(normalizedUsername, record);

  // Attach helper functions for auth controller
  req.loginRateLimiter = {
    recordFailedAttempt: () => {
      record.attempts += 1;
      
      if (record.attempts >= MAX_ATTEMPTS) {
        record.lockedUntil = now + LOCKOUT_DURATION;
        console.log(`Locked out: ${normalizedUsername} (${record.attempts} attempts)`);
      }
      
      loginAttempts.set(normalizedUsername, record);
      
      return {
        attempts: record.attempts,
        remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts),
        isLocked: record.lockedUntil !== null
      };
    },
    
    resetAttempts: () => {
      loginAttempts.delete(normalizedUsername);
      console.log(`Attempts reset: ${normalizedUsername}`);
    }
  };

  next();
};

module.exports = {
  checkLoginRateLimit
};
