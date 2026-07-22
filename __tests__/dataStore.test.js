/**
 * Unit tests for StudentDataStore
 * Tests data persistence logic without file I/O side effects
 */

const fs = require("fs");
const path = require("path");
const StudentDataStore = require("../lib/dataStore");

// Mock the file system
jest.mock("fs");

describe("StudentDataStore", () => {
  let dataStore;
  const testFilePath = "/test/data/students.json";

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockReturnValue(undefined);
    fs.writeFileSync.mockReturnValue(undefined);
    
    dataStore = new StudentDataStore(testFilePath);
  });

  describe("getAllStudents", () => {
    it("should return an empty array when no students exist", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("[]");

      const students = dataStore.getAllStudents();

      expect(students).toEqual([]);
      expect(fs.readFileSync).toHaveBeenCalledWith(testFilePath, "utf8");
    });

    it("should return array of students when data exists", () => {
      const mockStudents = [
        { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 },
        { id: "2", name: "Jane", email: "jane@example.com", course: "Science", grade: 85 },
      ];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockStudents));

      const students = dataStore.getAllStudents();

      expect(students).toEqual(mockStudents);
      expect(students).toHaveLength(2);
    });

    it("should throw error if JSON parsing fails", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("invalid json");

      expect(() => dataStore.getAllStudents()).toThrow("Failed to read student data");
    });

    it("should create data file if it does not exist", () => {
      fs.existsSync.mockReturnValue(false);
      fs.readFileSync.mockReturnValue("[]");

      dataStore.getAllStudents();

      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("findStudentById", () => {
    it("should return student by ID", () => {
      const mockStudents = [
        { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 },
        { id: "2", name: "Jane", email: "jane@example.com", course: "Science", grade: 85 },
      ];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockStudents));

      const student = dataStore.findStudentById("1");

      expect(student).toEqual(mockStudents[0]);
      expect(student.name).toBe("John");
    });

    it("should return null if student not found", () => {
      const mockStudents = [{ id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 }];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockStudents));

      const student = dataStore.findStudentById("999");

      expect(student).toBeNull();
    });
  });

  describe("createStudent", () => {
    it("should create a new student with auto-generated ID", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("[]");

      const newStudent = {
        name: "John",
        email: "john@example.com",
        course: "Math",
        grade: 90,
      };

      const created = dataStore.createStudent(newStudent);

      expect(created).toHaveProperty("id");
      expect(created.name).toBe("John");
      expect(created.email).toBe("john@example.com");
      expect(created.course).toBe("Math");
      expect(created.grade).toBe(90);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should add student to existing students array", () => {
      const existingStudents = [{ id: "1", name: "Jane", email: "jane@example.com", course: "Science", grade: 85 }];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingStudents));

      const newStudent = {
        name: "John",
        email: "john@example.com",
        course: "Math",
        grade: 90,
      };

      dataStore.createStudent(newStudent);

      const writeCall = fs.writeFileSync.mock.calls[0];
      const savedData = JSON.parse(writeCall[1]);

      expect(savedData).toHaveLength(2);
      expect(savedData[1].name).toBe("John");
    });

    it("should throw error if write fails", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("[]");
      fs.writeFileSync.mockImplementation(() => {
        throw new Error("Write failed");
      });

      expect(() => dataStore.createStudent({ name: "John", email: "john@example.com", course: "Math", grade: 90 })).toThrow(
        "Failed to save student data"
      );
    });
  });

  describe("updateStudent", () => {
    it("should update an existing student", () => {
      const existingStudents = [{ id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 }];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingStudents));

      const updated = dataStore.updateStudent("1", { grade: 95 });

      expect(updated.id).toBe("1");
      expect(updated.grade).toBe(95);
      expect(updated.name).toBe("John");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should return null if student not found", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("[]");

      const updated = dataStore.updateStudent("999", { grade: 95 });

      expect(updated).toBeNull();
    });

    it("should allow partial updates", () => {
      const existingStudents = [{ id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 }];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingStudents));

      const updated = dataStore.updateStudent("1", { course: "Science" });

      expect(updated.name).toBe("John");
      expect(updated.email).toBe("john@example.com");
      expect(updated.course).toBe("Science");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("deleteStudent", () => {
    it("should delete a student by ID", () => {
      const existingStudents = [
        { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 },
        { id: "2", name: "Jane", email: "jane@example.com", course: "Science", grade: 85 },
      ];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingStudents));

      const deleted = dataStore.deleteStudent("1");

      expect(deleted).toBe(true);
      const writeCall = fs.writeFileSync.mock.calls[0];
      const savedData = JSON.parse(writeCall[1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe("2");
    });

    it("should return false if student not found", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("[]");

      const deleted = dataStore.deleteStudent("999");

      expect(deleted).toBe(false);
    });

    it("should handle deleting from single student", () => {
      const existingStudents = [{ id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 }];

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingStudents));

      const deleted = dataStore.deleteStudent("1");

      expect(deleted).toBe(true);
      const writeCall = fs.writeFileSync.mock.calls[0];
      const savedData = JSON.parse(writeCall[1]);
      expect(savedData).toHaveLength(0);
    });
  });
});
