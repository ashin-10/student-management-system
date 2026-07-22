/**
 * API Routes
 * Handles all student management endpoints
 * Express router pattern for better organization
 */

const express = require("express");
const { validateStudent } = require("./validation");

function createStudentRoutes(dataStore) {
  const router = express.Router();

  /**
   * GET /api/students
   * Retrieve all students
   */
  router.get("/", (req, res, next) => {
    try {
      const students = dataStore.getAllStudents();
      res.json(students);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/students/:id
   * Retrieve a specific student by ID
   */
  router.get("/:id", (req, res, next) => {
    try {
      const student = dataStore.findStudentById(req.params.id);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /api/students
   * Create a new student
   */
  router.post("/", validateStudent, (req, res, next) => {
    try {
      const student = dataStore.createStudent(res.locals.studentData);
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  });

  /**
   * PUT /api/students/:id
   * Update an existing student
   */
  router.put("/:id", validateStudent, (req, res, next) => {
    try {
      const student = dataStore.updateStudent(req.params.id, res.locals.studentData);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /api/students/:id
   * Delete a student
   */
  router.delete("/:id", (req, res, next) => {
    try {
      const deleted = dataStore.deleteStudent(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createStudentRoutes;
