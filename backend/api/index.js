// Vercel API entry point - handles all routes
const path = require('path');

// Set up the environment for the server
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Import the Express app
const app = require('../src/server.js');

// Export the handler for Vercel
module.exports = app;
