/**
 * Unit tests for Validation utilities
 * Tests input validation and email validation
 */

const { validateStudentData, isValidEmail, validateStudent } = require("../lib/validation");

describe("isValidEmail", () => {
  it("should validate correct email addresses", () => {
    expect(isValidEmail("john@example.com")).toBe(true);
    expect(isValidEmail("user+tag@domain.co.uk")).toBe(true);
    expect(isValidEmail("student@university.edu")).toBe(true);
  });

  it("should reject invalid email addresses", () => {
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("should reject emails with spaces", () => {
    expect(isValidEmail("john @example.com")).toBe(false);
    expect(isValidEmail("john@ example.com")).toBe(false);
  });
});

describe("validateStudentData", () => {
  const validStudent = {
    name: "John Doe",
    email: "john@example.com",
    course: "Mathematics",
    grade: 85,
  };

  describe("name validation", () => {
    it("should accept valid name", () => {
      const result = validateStudentData(validStudent);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should reject missing name", () => {
      const result = validateStudentData({ ...validStudent, name: "" });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Name");
    });

    it("should reject null name", () => {
      const result = validateStudentData({ ...validStudent, name: null });
      expect(result.isValid).toBe(false);
    });

    it("should reject non-string name", () => {
      const result = validateStudentData({ ...validStudent, name: 123 });
      expect(result.isValid).toBe(false);
    });

    it("should reject whitespace-only name", () => {
      const result = validateStudentData({ ...validStudent, name: "   " });
      expect(result.isValid).toBe(false);
    });
  });

  describe("email validation", () => {
    it("should accept valid email", () => {
      const result = validateStudentData(validStudent);
      expect(result.isValid).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = validateStudentData({ ...validStudent, email: "notanemail" });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("email");
    });

    it("should reject missing email", () => {
      const result = validateStudentData({ ...validStudent, email: "" });
      expect(result.isValid).toBe(false);
    });

    it("should reject non-string email", () => {
      const result = validateStudentData({ ...validStudent, email: 123 });
      expect(result.isValid).toBe(false);
    });
  });

  describe("course validation", () => {
    it("should accept valid course", () => {
      const result = validateStudentData(validStudent);
      expect(result.isValid).toBe(true);
    });

    it("should reject missing course", () => {
      const result = validateStudentData({ ...validStudent, course: "" });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Course");
    });

    it("should reject non-string course", () => {
      const result = validateStudentData({ ...validStudent, course: 123 });
      expect(result.isValid).toBe(false);
    });

    it("should reject whitespace-only course", () => {
      const result = validateStudentData({ ...validStudent, course: "   " });
      expect(result.isValid).toBe(false);
    });
  });

  describe("grade validation", () => {
    it("should accept valid grade", () => {
      const result = validateStudentData(validStudent);
      expect(result.isValid).toBe(true);
    });

    it("should accept grade boundaries", () => {
      expect(validateStudentData({ ...validStudent, grade: 0 }).isValid).toBe(true);
      expect(validateStudentData({ ...validStudent, grade: 100 }).isValid).toBe(true);
    });

    it("should reject grade below 0", () => {
      const result = validateStudentData({ ...validStudent, grade: -1 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Grade");
    });

    it("should reject grade above 100", () => {
      const result = validateStudentData({ ...validStudent, grade: 101 });
      expect(result.isValid).toBe(false);
    });

    it("should reject non-numeric grade", () => {
      const result = validateStudentData({ ...validStudent, grade: "not a number" });
      expect(result.isValid).toBe(false);
    });

    it("should reject missing grade", () => {
      const result = validateStudentData({ ...validStudent, grade: undefined });
      expect(result.isValid).toBe(false);
    });

    it("should convert string number grade", () => {
      const result = validateStudentData({ ...validStudent, grade: "85" });
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateStudent middleware", () => {
    it("should call next if validation passes", () => {
      const req = { body: validStudent };
      const res = { locals: {} };
      const next = jest.fn();

      validateStudent(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.locals.studentData).toBeDefined();
      expect(res.locals.studentData.name).toBe("John Doe");
    });

    it("should return 400 error if validation fails", () => {
      const req = { body: { ...validStudent, email: "invalid" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateStudent(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should trim whitespace from string fields", () => {
      const req = {
        body: {
          name: "  John Doe  ",
          email: "  john@example.com  ",
          course: "  Math  ",
          grade: 85,
        },
      };
      const res = { 
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateStudent(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.locals.studentData.name).toBe("John Doe");
      expect(res.locals.studentData.email).toBe("john@example.com");
      expect(res.locals.studentData.course).toBe("Math");
    });

    it("should convert grade to number", () => {
      const req = { body: { ...validStudent, grade: "95" } };
      const res = { locals: {} };
      const next = jest.fn();

      validateStudent(req, res, next);

      expect(res.locals.studentData.grade).toBe(95);
      expect(typeof res.locals.studentData.grade).toBe("number");
    });
  });
});
