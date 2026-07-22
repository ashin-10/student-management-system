/**
 * Validation Middleware and Utilities
 * Centralized validation logic for student data
 */

/**
 * Validate student data
 * @param {Object} data - Data to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validateStudentData(data) {
  const { name, email, course, grade } = data;

  // Type check and trim string fields
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { isValid: false, error: "Name is required and must be a non-empty string" };
  }

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    return { isValid: false, error: "Valid email is required" };
  }

  if (!course || typeof course !== "string" || course.trim().length === 0) {
    return { isValid: false, error: "Course is required and must be a non-empty string" };
  }

  const gradeNum = Number(grade);
  if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
    return { isValid: false, error: "Grade must be a number between 0 and 100" };
  }

  return { isValid: true, error: null };
}

/**
 * Simple email validation
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validation middleware for request body
 * Checks student data and sets res.locals if valid
 */
function validateStudent(req, res, next) {
  const validation = validateStudentData(req.body);

  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  // Normalize and store validated data
  res.locals.studentData = {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    course: req.body.course.trim(),
    grade: Number(req.body.grade),
  };

  next();
}

/**
 * Error handling middleware
 * Catches errors and sends proper responses
 */
function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
}

module.exports = {
  validateStudentData,
  isValidEmail,
  validateStudent,
  errorHandler,
};
