// Vercel Serverless Function Entry Point
// This is the main entry point for Vercel deployment

const path = require("path");

// Load environment variables
require("dotenv").config();

// Import and export the Express app
const app = require("./src/server.js");

// Export for Vercel serverless functions
module.exports = app;
