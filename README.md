# 📚 Student Management Portal

A modern, full-stack student management application built with **Node.js**, **Express**, **HTML**, **CSS**, and **vanilla JavaScript**. Features a clean REST API with JSON-based persistent storage and a responsive web interface.

## ✨ Features

- **CRUD Operations**: Create, Read, Update, and Delete student records
- **REST API**: Fully functional Express API with proper HTTP status codes
- **JSON Storage**: Persistent data stored in `data/students.json`
- **Responsive UI**: Mobile-friendly student directory and form
- **Input Validation**: Server-side validation for all student fields
- **Error Handling**: Comprehensive error messages and status codes
- **Jest Test Suite**: 67 automated tests with 100% pass rate
- **Professional Code**: Refactored with separation of concerns and best practices

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashin-10/student-management-system.git
   cd student-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📋 Project Structure

```
student-management-system/
├── server.js                 # Main Express application entry point
├── lib/
│   ├── dataStore.js         # Data persistence layer (CRUD operations)
│   ├── routes.js            # API route definitions
│   └── validation.js        # Input validation and error handling
├── public/
│   ├── index.html           # Frontend HTML
│   ├── styles.css           # Styling
│   └── app.js               # Frontend JavaScript (fetch API integration)
├── data/
│   └── students.json        # JSON database file (auto-created)
├── __tests__/
│   ├── dataStore.test.js    # DataStore unit tests
│   ├── validation.test.js   # Validation unit tests
│   └── routes.test.js       # API integration tests
├── jest.config.js           # Jest configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Available Commands

```bash
# Start development server
npm start

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Check syntax
node -c server.js
```

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### **GET** `/api/students`
Retrieve all students
```bash
curl http://localhost:3000/api/students
```
**Response:** `200 OK`
```json
[
  {
    "id": "1784695249744",
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Mathematics",
    "grade": 90
  }
]
```

---

#### **GET** `/api/students/:id`
Retrieve a specific student by ID
```bash
curl http://localhost:3000/api/students/1784695249744
```
**Response:** `200 OK` or `404 Not Found`

---

#### **POST** `/api/students`
Create a new student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Mathematics",
    "grade": 90
  }'
```
**Response:** `201 Created`
```json
{
  "id": "1784695249744",
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Mathematics",
  "grade": 90
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `course`: Required, non-empty string
- `grade`: Required, number between 0-100

---

#### **PUT** `/api/students/:id`
Update an existing student
```bash
curl -X PUT http://localhost:3000/api/students/1784695249744 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "course": "Physics",
    "grade": 95
  }'
```
**Response:** `200 OK` or `404 Not Found`

---

#### **DELETE** `/api/students/:id`
Delete a student
```bash
curl -X DELETE http://localhost:3000/api/students/1784695249744
```
**Response:** `204 No Content` or `404 Not Found`

---

### Error Responses

All errors return appropriate HTTP status codes with error messages:

```json
{
  "error": "Valid email is required"
}
```

| Status | Meaning |
|--------|---------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE success) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Server Error |

## 🧪 Testing

The project includes comprehensive Jest test coverage with 67 tests across 3 suites:

### Run Tests
```bash
npm test
```

### Test Results
```
Test Suites: 3 passed, 3 total
Tests:       67 passed, 67 total
Time:        ~1 second
```

### Test Suites

1. **Data Store Tests** (`__tests__/dataStore.test.js`)
   - CRUD operations on JSON file
   - Error handling
   - File system interactions

2. **Validation Tests** (`__tests__/validation.test.js`)
   - Input validation
   - Email format checking
   - Type validation

3. **Routes Tests** (`__tests__/routes.test.js`)
   - API endpoint responses
   - HTTP status codes
   - Integration testing

For detailed testing documentation, see [TESTING.md](TESTING.md).

## 💾 Data Storage

Student data is persisted in `data/students.json`:

```json
[
  {
    "id": "1784695249744",
    "name": "John Doe",
    "email": "john@example.com",
    "course": "Mathematics",
    "grade": 90
  },
  {
    "id": "1784695250000",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "course": "Physics",
    "grade": 85
  }
]
```

- File is automatically created on first run
- Data persists between server restarts
- Safe concurrent access with synchronous file operations

## 🏗️ Architecture

### Backend Architecture

```
Express App
    ↓
Routes (lib/routes.js)
    ↓
Validation Middleware (lib/validation.js)
    ↓
DataStore Class (lib/dataStore.js)
    ↓
File System (data/students.json)
```

### Frontend Architecture

```
Browser (index.html)
    ↓
Fetch API (app.js)
    ↓
Express Server (server.js)
    ↓
API Routes (/api/students)
```

## 🔒 Best Practices Implemented

- **Separation of Concerns**: Routes, validation, and data access are separate modules
- **Error Handling**: Global error middleware catches all exceptions
- **Input Validation**: Server-side validation before data processing
- **Responsive Design**: CSS Grid and Flexbox for mobile compatibility
- **Code Documentation**: JSDoc comments on all functions
- **Testing**: Comprehensive Jest test suite with mocking
- **Environment Configuration**: Supports NODE_ENV and PORT environment variables

## 🌍 Environment Variables

```bash
PORT=3000              # Server port (default: 3000)
NODE_ENV=development   # Environment (development/production)
```

Example:
```bash
PORT=8080 NODE_ENV=production npm start
```

## 📦 Dependencies

### Production
- **express** ^4.19.2 - Web framework

### Development
- **jest** ^29.7.0 - Testing framework
- **supertest** ^6.3.4 - HTTP assertion library

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm start

# Or kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### JSON File Corrupted
```bash
# Delete and let app recreate it
rm data/students.json
npm start
```

### Tests Failing
```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

### CORS Issues
The server serves both API and static files from the same origin, so CORS shouldn't be an issue. If you need to access from a different origin, you'll need to add CORS middleware.

## 🚀 Deployment

### Heroku
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### AWS/GCP/Azure
See deployment docs for your platform. Ensure:
- Node.js runtime available
- PORT environment variable respected
- Writable file system for data/students.json (or use database)

## 🔄 CI/CD

This project includes GitHub Actions workflow for automated testing. See `.github/workflows/test.yml`.

Tests run automatically on every push to ensure code quality.

## 📝 API Examples

### JavaScript (Fetch API)
```javascript
// Create student
const response = await fetch('/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    course: 'Math',
    grade: 90
  })
});
const student = await response.json();
```

### Python (Requests)
```python
import requests

response = requests.post('http://localhost:3000/api/students', json={
    'name': 'John Doe',
    'email': 'john@example.com',
    'course': 'Math',
    'grade': 90
})
print(response.json())
```

### cURL
```bash
curl -X POST http://localhost:3000/api/students \
  -H 'Content-Type: application/json' \
  -d '{"name":"John","email":"john@example.com","course":"Math","grade":90}'
```

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Jest Testing Guide](https://jestjs.io/)
- [REST API Best Practices](https://restfulapi.net/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 👨‍💻 Development Workflow

1. **Make changes** to server or frontend code
2. **Run tests** to verify: `npm test`
3. **Test manually** in browser: `npm start`
4. **Commit** changes: `git add . && git commit -m "message"`
5. **Push** to GitHub (CI/CD runs automatically)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add/update tests
4. Run `npm test` to verify
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check [TESTING.md](TESTING.md) for testing details
- Review error messages in console
- Check browser DevTools for frontend errors
- Run tests with verbose output: `npm test -- --verbose`

---

**Happy coding! 🎉**
