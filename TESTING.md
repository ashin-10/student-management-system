# Jest Test Suite for Student Management API

## Overview
Comprehensive test coverage for the Student Management Portal backend with 67 passing tests across 3 test suites.

## Test Suites

### 1. **Data Store Tests** (`__tests__/dataStore.test.js`) - 20 tests
Tests the `StudentDataStore` class for data persistence operations.

**Coverage:**
- `getAllStudents()` - Read all students from JSON file
- `findStudentById(id)` - Find a specific student
- `createStudent(data)` - Add new student with auto-generated ID
- `updateStudent(id, updates)` - Update student fields
- `deleteStudent(id)` - Remove student from storage

**Key Tests:**
- ✓ Empty data file handling
- ✓ Multiple students in storage
- ✓ JSON parsing error handling
- ✓ Partial updates (preserve unchanged fields)
- ✓ File write error handling

### 2. **Validation Tests** (`__tests__/validation.test.js`) - 27 tests
Tests input validation utilities and middleware.

**Coverage:**
- `isValidEmail(email)` - Email format validation
- `validateStudentData(data)` - Full data validation
- `validateStudent` - Express middleware for request validation

**Validation Rules:**
- ✓ Name: Non-empty string, max length
- ✓ Email: Valid email format with regex
- ✓ Course: Non-empty string
- ✓ Grade: Number 0-100
- ✓ Whitespace trimming
- ✓ Type checking (reject non-strings)

### 3. **Routes/API Tests** (`__tests__/routes.test.js`) - 20 tests
Integration tests for Express endpoints using supertest.

**Coverage:**

| Endpoint | Method | Tests |
|----------|--------|-------|
| `/api/students` | GET | All students, empty list, errors |
| `/api/students/:id` | GET | Single student, 404, errors |
| `/api/students` | POST | Create, validation, errors |
| `/api/students/:id` | PUT | Update, validation, 404, errors |
| `/api/students/:id` | DELETE | Delete, 404, errors |
| `*` | GET | SPA fallback to index.html |

**Key Tests:**
- ✓ Status codes (200, 201, 204, 400, 404, 500)
- ✓ JSON content-type headers
- ✓ Error responses with descriptions
- ✓ Validation middleware integration
- ✓ Mock dataStore integration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run specific test file
npm test -- __tests__/dataStore.test.js

# Run with coverage report
npm test -- --coverage
```

## Test Results Summary
```
Test Suites: 3 passed, 3 total
Tests:       67 passed, 67 total
Time:        ~1 second
```

## Coverage Thresholds

The Jest configuration enforces minimum coverage:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Mocking Strategy

### File System (fs)
- `fs.existsSync()` - Mocked to check file existence
- `fs.readFileSync()` - Mocked to return test data
- `fs.writeFileSync()` - Mocked to prevent actual file writes
- `fs.mkdirSync()` - Mocked to prevent directory creation

### Express
- `StudentDataStore` - Mocked for API route tests
- `req.body` - Test data passed directly
- `res.status()` / `res.json()` - Spy mocks to verify responses

### Benefits:
- ✓ Fast execution (no file I/O)
- ✓ Isolated tests (no side effects)
- ✓ Repeatable results
- ✓ Easy to test error scenarios

## Example Test Pattern

```javascript
describe("GET /api/students", () => {
  it("should return all students", async () => {
    const mockStudents = [
      { id: "1", name: "John", email: "john@example.com", course: "Math", grade: 90 }
    ];
    
    mockDataStore.getAllStudents.mockReturnValue(mockStudents);
    
    const response = await request(app).get("/api/students");
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStudents);
  });
});
```

## Error Handling Tests

All routes include error scenario coverage:

```javascript
it("should handle dataStore errors", async () => {
  mockDataStore.getAllStudents.mockImplementation(() => {
    throw new Error("Read error");
  });

  const response = await request(app).get("/api/students");
  
  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty("error");
});
```

## Best Practices Demonstrated

1. **Mocking** - fs module and dataStore for isolation
2. **Async/Await** - Proper handling of async operations
3. **Fixtures** - Reusable test data (mockStudents)
4. **beforeEach** - Setup/teardown for each test
5. **Descriptive Names** - Clear test intentions
6. **Comprehensive Coverage** - Happy paths + error cases
7. **Single Responsibility** - One assertion per test concept
8. **DRY** - Reusable mock setup functions

## Tips for Adding New Tests

1. **For new data operations:**
   - Add tests to `__tests__/dataStore.test.js`
   - Mock fs appropriately
   - Test both success and error paths

2. **For new API endpoints:**
   - Add tests to `__tests__/routes.test.js`
   - Use supertest for HTTP testing
   - Verify status codes, headers, and body

3. **For new validation rules:**
   - Add tests to `__tests__/validation.test.js`
   - Test valid inputs, invalid inputs, edge cases
   - Update validateStudent middleware if needed

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm test -- --coverage
```

All tests are deterministic and can run in parallel.
