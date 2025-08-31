import { verifyPassword } from "../utils/passwordUtils.js";

// Test the bcrypt verification with the generated hashes
const testPasswordVerification = async () => {
  console.log("🔒 Testing Password Verification\n");

  const testCases = [
    {
      password: "sdo123",
      hash: "$2a$12$kHg8PaUiGNEi9kf4otYX8.ECAABI.DpAUT6uqjwln.pHuIXzg5fDy",
      description: "SDO password",
    },
    {
      password: "cces123",
      hash: "$2a$12$u2whouBJ4vAWhUWr4VeuTeQX4dF8ezMPmTm3Ne9HdXVT0ph59nKcG",
      description: "CCES password",
    },
    {
      password: "api123",
      hash: "$2a$12$2rty6bhayQR4tfbIomJBu.IIYg/JHd.4Pa53iClp0MSORY6m.fMY6",
      description: "API password",
    },
    {
      password: "director123",
      hash: "$2a$12$oF4HliGa8k3z2.RjIsY.b.4rMxMtl0Kgc2zediQRCDMxiYjmzFuNK",
      description: "Director password",
    },
    {
      password: "wrongpassword",
      hash: "$2a$12$kHg8PaUiGNEi9kf4otYX8.ECAABI.DpAUT6uqjwln.pHuIXzg5fDy",
      description: "Wrong password test",
    },
  ];

  for (const testCase of testCases) {
    try {
      const isValid = await verifyPassword(testCase.password, testCase.hash);
      const status = isValid ? "✅ VALID" : "❌ INVALID";
      console.log(`${testCase.description}: ${status}`);

      if (testCase.password === "wrongpassword" && isValid) {
        console.error("⚠️  Security issue: Wrong password was accepted!");
      } else if (testCase.password !== "wrongpassword" && !isValid) {
        console.error("⚠️  Issue: Correct password was rejected!");
      }
    } catch (error) {
      console.error(`❌ Error testing ${testCase.description}:`, error.message);
    }
  }

  console.log("\n✅ Password verification testing completed!");
};

testPasswordVerification();
