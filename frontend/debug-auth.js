// Debug script to test authentication flow
// Run with: node debug-auth.js

// Simulate localStorage for Node environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

// Mock localStorage in global scope
global.localStorage = localStorageMock;

console.log("=== DEBUGGING AUTH ISSUE ===");

// Test 1: Check what happens when localStorage is empty
console.log("\n1. Testing empty localStorage:");
console.log("authToken:", localStorage.getItem("authToken"));
console.log("userType:", localStorage.getItem("userType"));
console.log("userData:", localStorage.getItem("userData"));

// Test 2: Simulate a successful login
console.log("\n2. Simulating successful login:");
const mockSessionData = {
  token: `office_test123_${Date.now()}`,
  userType: "office",
  user: {
    id: "test123",
    email: "test@example.com",
    name: "Test User",
    role: "office_user",
    office_id: "office123",
  },
};

localStorage.setItem("authToken", mockSessionData.token);
localStorage.setItem("userType", mockSessionData.userType);
localStorage.setItem("userData", JSON.stringify(mockSessionData.user));

console.log("Stored in localStorage:");
console.log("authToken:", localStorage.getItem("authToken"));
console.log("userType:", localStorage.getItem("userType"));
console.log("userData:", localStorage.getItem("userData"));

// Test 3: Simulate verifyToken function
console.log("\n3. Testing verifyToken logic:");
const verifyToken = () => {
  try {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    const userData = localStorage.getItem("userData");

    console.log("Raw values:");
    console.log("  token:", token);
    console.log("  userType:", userType);
    console.log("  userData:", userData);

    if (!token || !userType || !userData) {
      console.log("Missing data - returning error");
      return { error: "No valid session", user: null };
    }

    const parsedUserData = JSON.parse(userData);
    console.log("Parsed user data:", parsedUserData);

    return {
      user: parsedUserData,
      userType,
      token,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return { error: "Invalid session", user: null };
  }
};

const result = verifyToken();
console.log("verifyToken result:", result);

// Test 4: Check what React Query would see
console.log("\n4. What React Query would receive:");
if (result.error || !result.user) {
  console.log("React Query would get: null (no session)");
} else {
  console.log("React Query would get:", {
    token: result.token,
    userType: result.userType,
    user: result.user,
  });
}

console.log("\n=== DEBUG COMPLETE ===");
