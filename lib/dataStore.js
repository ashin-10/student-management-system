/**
 * Data Access Layer (DAL)
 * Handles all file I/O operations for student data
 * Separation of concerns: data persistence logic is isolated
 */

const fs = require("fs");
const path = require("path");

class StudentDataStore {
  constructor(dataFilePath) {
    this.dataFilePath = dataFilePath;
    this.dataDir = path.dirname(dataFilePath);
  }

  /**
   * Ensure data file and directory exist
   * Creates them if they don't exist
   */
  _ensureDataFile() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.dataFilePath)) {
      fs.writeFileSync(this.dataFilePath, JSON.stringify([], null, 2));
    }
  }

  /**
   * Read all students from JSON file
   * @returns {Array} Array of student objects
   * @throws {Error} If file cannot be read or JSON is invalid
   */
  getAllStudents() {
    try {
      this._ensureDataFile();
      const rawData = fs.readFileSync(this.dataFilePath, "utf8");
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error reading students file:", error);
      throw new Error("Failed to read student data");
    }
  }

  /**
   * Write students array to JSON file
   * @param {Array} students - Array of student objects
   * @throws {Error} If file cannot be written
   */
  saveAllStudents(students) {
    try {
      this._ensureDataFile();
      fs.writeFileSync(this.dataFilePath, JSON.stringify(students, null, 2));
    } catch (error) {
      console.error("Error writing students file:", error);
      throw new Error("Failed to save student data");
    }
  }

  /**
   * Find a student by ID
   * @param {string} id - Student ID
   * @returns {Object|null} Student object or null if not found
   */
  findStudentById(id) {
    const students = this.getAllStudents();
    return students.find((student) => student.id === id) || null;
  }

  /**
   * Create a new student
   * @param {Object} studentData - Student data (name, email, course, grade)
   * @returns {Object} Created student with ID
   */
  createStudent(studentData) {
    const students = this.getAllStudents();
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
    };

    students.push(newStudent);
    this.saveAllStudents(students);
    return newStudent;
  }

  /**
   * Update an existing student
   * @param {string} id - Student ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated student or null if not found
   */
  updateStudent(id, updates) {
    const students = this.getAllStudents();
    const studentIndex = students.findIndex((student) => student.id === id);

    if (studentIndex === -1) {
      return null;
    }

    students[studentIndex] = {
      ...students[studentIndex],
      ...updates,
    };

    this.saveAllStudents(students);
    return students[studentIndex];
  }

  /**
   * Delete a student
   * @param {string} id - Student ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteStudent(id) {
    const students = this.getAllStudents();
    const filteredStudents = students.filter((student) => student.id !== id);

    if (filteredStudents.length === students.length) {
      return false;
    }

    this.saveAllStudents(filteredStudents);
    return true;
  }
}

module.exports = StudentDataStore;
