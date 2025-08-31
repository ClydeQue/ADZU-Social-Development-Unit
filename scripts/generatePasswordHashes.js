const bcrypt = require("bcryptjs");

// Plain text passwords from your database setup
const plainTextPasswords = {
  sdo123: "SDO password",
  cces123: "CCES password",
  api123: "API password",
  sacsi123: "SACSI password",
  aclg123: "ACLG password",
  acca123: "ACCA password",
  director123: "Unit Director password",
  admin123: "Admin password",
};

async function generateHashes() {
  console.log("Generating bcrypt hashes for plain text passwords...\n");

  const saltRounds = 12;
  const hashes = {};

  for (const [plainPassword, description] of Object.entries(
    plainTextPasswords
  )) {
    try {
      const hash = await bcrypt.hash(plainPassword, saltRounds);
      hashes[plainPassword] = hash;
      console.log(`${description}:`);
      console.log(`  Plain: ${plainPassword}`);
      console.log(`  Hash:  ${hash}`);
      console.log(
        `  SQL:   UPDATE table_name SET password = '${hash}' WHERE password = '${plainPassword}';`
      );
      console.log("");
    } catch (error) {
      console.error(`Error hashing ${plainPassword}:`, error);
    }
  }

  return hashes;
}

// Verify that hashes work correctly
async function verifyHashes(hashes) {
  console.log("\nVerifying generated hashes...\n");

  for (const [plainPassword, hash] of Object.entries(hashes)) {
    try {
      const isValid = await bcrypt.compare(plainPassword, hash);
      console.log(`${plainPassword} -> ${isValid ? "✅ VALID" : "❌ INVALID"}`);
    } catch (error) {
      console.error(`Error verifying ${plainPassword}:`, error);
    }
  }
}

// Generate SQL migration script
function generateMigrationSQL(hashes) {
  console.log("\n=== MIGRATION SQL SCRIPT ===\n");
  console.log("-- Update office_users table with bcrypt hashes");

  const passwordMappings = [
    { email: "sdo@adzu.edu.ph", password: "sdo123" },
    { email: "sdo2@adzu.edu.ph", password: "sdo123" },
    { email: "cces@adzu.edu.ph", password: "cces123" },
    { email: "cces2@adzu.edu.ph", password: "cces123" },
    { email: "api@adzu.edu.ph", password: "api123" },
    { email: "api2@adzu.edu.ph", password: "api123" },
    { email: "sacsi@adzu.edu.ph", password: "sacsi123" },
    { email: "sacsi2@adzu.edu.ph", password: "sacsi123" },
    { email: "aclg@adzu.edu.ph", password: "aclg123" },
    { email: "aclg2@adzu.edu.ph", password: "aclg123" },
    { email: "acca@adzu.edu.ph", password: "acca123" },
    { email: "acca2@adzu.edu.ph", password: "acca123" },
  ];

  passwordMappings.forEach(({ email, password }) => {
    if (hashes[password]) {
      console.log(
        `UPDATE office_users SET password = '${hashes[password]}' WHERE email = '${email}';`
      );
    }
  });

  console.log("\n-- Update unit_directors table with bcrypt hashes");
  console.log(
    `UPDATE unit_directors SET password = '${hashes["director123"]}' WHERE email = 'director@adzu.edu.ph';`
  );
  console.log(
    `UPDATE unit_directors SET password = '${hashes["admin123"]}' WHERE email = 'admin@adzu.edu.ph';`
  );

  console.log("\n-- Verify updates");
  console.log("SELECT email, password FROM office_users;");
  console.log("SELECT email, password FROM unit_directors;");
}

// Run the script
async function main() {
  try {
    const hashes = await generateHashes();
    await verifyHashes(hashes);
    generateMigrationSQL(hashes);
  } catch (error) {
    console.error("Script failed:", error);
  }
}

main();
