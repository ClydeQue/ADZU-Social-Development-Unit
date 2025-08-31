import bcrypt from "bcryptjs";

// 🛡️ PASSWORD UTILITIES
export const passwordUtils = {
  // Hash a password with salt
  hashPassword: async (plainPassword) => {
    try {
      const saltRounds = 12; // Higher = more secure but slower
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Password hashing error:", error);
      throw new Error("Failed to hash password");
    }
  },

  // Verify password against hash
  verifyPassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Password verification error:", error);
      return false;
    }
  },

  // Generate hashes for existing passwords (development only)
  generateHashesForExistingPasswords: async (passwords) => {
    const hashes = {};

    for (const [identifier, password] of Object.entries(passwords)) {
      const hash = await passwordUtils.hashPassword(password);
      hashes[identifier] = {
        plainPassword: password,
        hashedPassword: hash,
      };
      console.log(`${identifier}: ${password} -> ${hash}`);
    }

    return hashes;
  },
};

// Named exports for easier importing
export const hashPassword = passwordUtils.hashPassword;
export const verifyPassword = passwordUtils.verifyPassword;

// 🔧 DEVELOPMENT HELPER: Generate hashes for your existing passwords
export const hashExistingPasswords = async () => {
  // Add your current plain text passwords here
  const currentPasswords = {
    // Office users - replace with your actual passwords
    "office1@example.com": "password123",
    "office2@example.com": "password123",
    "office3@example.com": "password123",
    "office4@example.com": "password123",
    "office5@example.com": "password123",
    "office6@example.com": "password123",

    // Unit directors - replace with your actual passwords
    "director@example.com": "admin123",
  };

  console.log("🔐 Generating password hashes...");
  const hashes = await passwordUtils.generateHashesForExistingPasswords(
    currentPasswords
  );

  console.log("\n📋 SQL UPDATE STATEMENTS:");
  console.log("Copy and paste these into your Supabase SQL editor:\n");

  // Generate SQL update statements
  for (const [email, data] of Object.entries(hashes)) {
    if (email.includes("office")) {
      console.log(
        `UPDATE office_users SET password = '${data.hashedPassword}' WHERE email = '${email}';`
      );
    } else {
      console.log(
        `UPDATE unit_directors SET password = '${data.hashedPassword}' WHERE email = '${email}';`
      );
    }
  }

  return hashes;
};
