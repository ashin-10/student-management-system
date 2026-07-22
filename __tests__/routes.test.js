/**
 * Integration tests for API endpoints
 * Tests the full HTTP request/response cycle using supertest
 */

const request = require("supertest");
const { createApp } = require("../server");
const StudentDataStore = require("../lib/dataStore");

// Mock the dataStore
jest.mock("../lib/dataStore");

describe("Student Management API", () => {
  let app;
  let mockDataStore;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock instance
    mockDataStore = {
      getAllStudents: jest.fn(),
      findStudentById: jest.fn(),
      createStudent: jest.fn(),
      updateStudent: jest.fn(),
      deleteStudent: jest.fn(),
    };

    // Mock the constructor
    StudentDataStore.mockImplementation(() => mockDataStore);

    // Create app with mocked dataStore
    app = createApp();
  });

  describe("GET /api/students", () => {
    it("should return all students", async () => {
      const mockStudents = [
        { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 },
        { id: "2", name: "Jane", email: "jane@example.com", course: "Science", grade: 85 },
      ];

      mockDataStore.getAllStudents.mockReturnValue(mockStudents);

      const response = await request(app).get("/api/students");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudents);
      expect(response.body).toHaveLength(2);
      expect(mockDataStore.getAllStudents).toHaveBeenCalled();
    });

    it("should return empty array when no students exist", async () => {
      mockDataStore.getAllStudents.mockReturnValue([]);

      const response = await request(app).get("/api/students");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should handle dataStore errors", async () => {
      mockDataStore.getAllStudents.mockImplementation(() => {
        throw new Error("Read error");
      });

      const response = await request(app).get("/api/students");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/students/:id", () => {
    it("should return a single student by ID", async () => {
      const mockStudent = { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 };

      mockDataStore.findStudentById.mockReturnValue(mockStudent);

      const response = await request(app).get("/api/students/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudent);
      expect(mockDataStore.findStudentById).toHaveBeenCalledWith("1");
    });

    it("should return 404 if student not found", async () => {
      mockDataStore.findStudentById.mockReturnValue(null);

      const response = await request(app).get("/api/students/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("not found");
    });

    it("should handle dataStore errors", async () => {
      mockDataStore.findStudentById.mockImplementation(() => {
        throw new Error("Read error");
      });

      const response = await request(app).get("/api/students/1");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/students", () => {
    const validStudent = {
      name: "John Doe",
      email: "john@example.com",
      course: "Mathematics",
      grade: 90,
    };

    it("should create a new student", async () => {
      const createdStudent = { id: "1", ...validStudent };
      mockDataStore.createStudent.mockReturnValue(createdStudent);

      const response = await request(app).post("/api/students").send(validStudent);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdStudent);
      expect(response.body).toHaveProperty("id");
      expect(mockDataStore.createStudent).toHaveBeenCalled();
    });

    it("should return 400 if required fields missing", async () => {
      const invalidStudent = { name: "John", email: "john@example.com" }; // missing course and grade

      const response = await request(app).post("/api/students").send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 if name is empty", async () => {
      const invalidStudent = { ...validStudent, name: "" };

      const response = await request(app).post("/api/students").send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Name");
    });

    it("should return 400 if email is invalid", async () => {
      const invalidStudent = { ...validStudent, email: "notanemail" };

      const response = await request(app).post("/api/students").send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("email");
    });

    it("should return 400 if grade is out of range", async () => {
      const invalidStudent = { ...validStudent, grade: 101 };

      const response = await request(app).post("/api/students").send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Grade");
    });

    it("should handle dataStore errors", async () => {
      mockDataStore.createStudent.mockImplementation(() => {
        throw new Error("Write error");
      });

      const response = await request(app).post("/api/students").send(validStudent);

      expect(response.status).toBe(500);
    });

    it("should trim whitespace from fields", async () => {
      const studentWithWhitespace = {
        name: "  John Doe  ",
        email: "  john@example.com  ",
        course: "  Math  ",
        grade: 90,
      };

      const createdStudent = { id: "1", ...validStudent };
      mockDataStore.createStudent.mockReturnValue(createdStudent);

      const response = await request(app).post("/api/students").send(studentWithWhitespace);

      expect(response.status).toBe(201);
      expect(mockDataStore.createStudent).toHaveBeenCalled();
      const callArgs = mockDataStore.createStudent.mock.calls[0][0];
      expect(callArgs.name).toBe("John Doe");
      expect(callArgs.email).toBe("john@example.com");
      expect(callArgs.course).toBe("Math");
    });
  });

  describe("PUT /api/students/:id", () => {
    const updateData = {
      name: "John Updated",
      email: "john.updated@example.com",
      course: "Physics",
      grade: 95,
    };

    it("should update an existing student", async () => {
      const updatedStudent = { id: "1", ...updateData };
      mockDataStore.updateStudent.mockReturnValue(updatedStudent);

      const response = await request(app).put("/api/students/1").send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedStudent);
      expect(mockDataStore.updateStudent).toHaveBeenCalledWith("1", expect.objectContaining(updateData));
    });

    it("should return 404 if student not found", async () => {
      mockDataStore.updateStudent.mockReturnValue(null);

      const response = await request(app).put("/api/students/999").send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 if required fields missing", async () => {
      const incompleteData = { name: "John" }; // missing email, course, grade

      const response = await request(app).put("/api/students/1").send(incompleteData);

      expect(response.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      const invalidData = { ...updateData, email: "notanemail" };

      const response = await request(app).put("/api/students/1").send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("email");
    });

    it("should return 400 if grade is out of range", async () => {
      const invalidData = { ...updateData, grade: -5 };

      const response = await request(app).put("/api/students/1").send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Grade");
    });

    it("should handle dataStore errors", async () => {
      mockDataStore.updateStudent.mockImplementation(() => {
        throw new Error("Update error");
      });

      const response = await request(app).put("/api/students/1").send(updateData);

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should delete an existing student", async () => {
      mockDataStore.deleteStudent.mockReturnValue(true);

      const response = await request(app).delete("/api/students/1");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(mockDataStore.deleteStudent).toHaveBeenCalledWith("1");
    });

    it("should return 404 if student not found", async () => {
      mockDataStore.deleteStudent.mockReturnValue(false);

      const response = await request(app).delete("/api/students/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    it("should handle dataStore errors", async () => {
      mockDataStore.deleteStudent.mockImplementation(() => {
        throw new Error("Delete error");
      });

      const response = await request(app).delete("/api/students/1");

      expect(response.status).toBe(500);
    });
  });

  describe("Static file serving", () => {
    it("should serve index.html as fallback for SPA", async () => {
      const response = await request(app).get("/nonexistent-route");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/html");
    });
  });

  describe("Content-Type and Response Headers", () => {
    it("should return JSON content-type for API responses", async () => {
      mockDataStore.getAllStudents.mockReturnValue([]);

      const response = await request(app).get("/api/students");

      expect(response.headers["content-type"]).toContain("application/json");
    });

    it("should accept JSON content-type in requests", async () => {
      const mockStudent = { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 };
      mockDataStore.createStudent.mockReturnValue(mockStudent);

      const response = await request(app)
        .post("/api/students")
        .set("Content-Type", "application/json")
        .send({
          name: "John",
          email: "john@example.com",
          course: "Math",
          grade: 90,
        });

      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toContain("application/json");
    });
  });
});
