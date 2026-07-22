/**
 * Student Management Portal - Express Server
 * Refactored following Node.js best practices
 * 
 * Best practices applied:
 * - Separation of concerns (routes, data, validation)
 * - Environment-based configuration
 * - Proper error handling middleware
 * - Class-based data access layer
 * - Router pattern for API routes
 * - JSDoc comments for documentation
 * - Consistent logging
 */

const express = require("express");
const path = require("path");
const StudentDataStore = require("./lib/dataStore");
const createStudentRoutes = require("./lib/routes");
const { errorHandler } = require("./lib/validation");

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const DATA_FILE_PATH = path.join(__dirname, "data", "students.json");

/**
 * Create and configure Express application
 * @returns {Object} Express app instance
 */
function createApp() {
  const app = express();
  const dataStore = new StudentDataStore(DATA_FILE_PATH);

  // ========== Middleware Setup ==========

  // Parse JSON request bodies
  app.use(express.json());

  // Serve static files (HTML, CSS, JS)
  app.use(express.static(path.join(__dirname, "public")));

  // Request logging middleware (development only)
  if (NODE_ENV === "development") {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  // ========== API Routes ==========

  // Mount student API routes
  app.use("/api/students", createStudentRoutes(dataStore));

  // ========== SPA Fallback ==========

  // Serve index.html for all other routes (Single Page App)
  // This allows React Router / Vue Router style routing on the frontend
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  // ========== Error Handling ==========

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Start the Express server
 * @returns {Object} Server instance
 */
function startServer() {
  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`✓ Student Management Portal running at http://localhost:${PORT}`);
    console.log(`✓ Environment: ${NODE_ENV}`);
  });

  // Graceful shutdown handling
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });

  return server;
}

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for testing
module.exports = {
  createApp,
  startServer,
};
