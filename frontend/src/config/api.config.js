/**
 * API Configuration
 * Centralized API endpoint management with automatic fallback
 */

export const API_CONFIG = {
  // API Endpoints
  LOCAL: "http://localhost:5001",
  PRODUCTION: "https://adzu-sdu-backend.vercel.app",
  
  // Environment variable (takes precedence if set)
  ENV: import.meta.env.VITE_API_URL,
  
  // Connection test timeout
  TIMEOUT: 2000, // 2 seconds
  
  // Request timeout
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Current active API base
let activeApiBase = API_CONFIG.ENV || API_CONFIG.LOCAL;
let isUsingFallback = false;

/**
 * Test if an API endpoint is available
 */
export async function testApiEndpoint(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(`${url}/api/health`, {
      signal: controller.signal,
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Initialize API configuration
 * Tests localhost and falls back to production if needed
 */
export async function initializeApiConfig() {
  // Skip test if environment variable is set
  if (API_CONFIG.ENV) {
    console.log("📡 Using environment API:", API_CONFIG.ENV);
    return API_CONFIG.ENV;
  }
  
  // Test localhost first
  console.log("🔍 Testing local backend...");
  const localAvailable = await testApiEndpoint(API_CONFIG.LOCAL);
  
  if (localAvailable) {
    console.log("✅ Connected to local backend:", API_CONFIG.LOCAL);
    activeApiBase = API_CONFIG.LOCAL;
    isUsingFallback = false;
  } else {
    console.warn("⚠️ Local backend unavailable, using production:", API_CONFIG.PRODUCTION);
    activeApiBase = API_CONFIG.PRODUCTION;
    isUsingFallback = true;
  }
  
  return activeApiBase;
}

/**
 * Get current API base URL
 */
export function getApiBase() {
  return activeApiBase;
}

/**
 * Set API base URL (for manual override or fallback)
 */
export function setApiBase(url) {
  activeApiBase = url;
  isUsingFallback = url === API_CONFIG.PRODUCTION;
  console.log(`🔄 API base switched to: ${url}`);
}

/**
 * Check if using fallback server
 */
export function isFallbackActive() {
  return isUsingFallback;
}

/**
 * Switch to production server
 */
export function switchToProduction() {
  setApiBase(API_CONFIG.PRODUCTION);
}

/**
 * Switch to local server
 */
export function switchToLocal() {
  setApiBase(API_CONFIG.LOCAL);
}

// Initialize on module load
initializeApiConfig().catch(console.error);

export default {
  CONFIG: API_CONFIG,
  getApiBase,
  setApiBase,
  isFallbackActive,
  switchToProduction,
  switchToLocal,
  testApiEndpoint,
};
