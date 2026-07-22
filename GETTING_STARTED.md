# 🚀 Getting Started Guide

Welcome to the Student Management Portal! This guide will get you up and running in minutes.

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14+): [Download](https://nodejs.org/)
- **Git**: [Download](https://git-scm.com/)
- **npm** (comes with Node.js)

Verify installation:
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
git --version     # Should be v2+
```

## 🎯 5-Minute Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/ashin-10/student-management-system.git
cd student-management-system
```

### Step 2: Install Dependencies
```bash
npm install
```
This installs Express, Jest, and other required packages.

### Step 3: Start Server
```bash
npm start
```
You should see:
```
✓ Student Management Portal running at http://localhost:3000
✓ Environment: development
```

### Step 4: Open Browser
Navigate to: **http://localhost:3000**

You should see the Student Management Portal with a form and table.

### Step 5: Try It Out
1. Fill in the form (Name, Email, Course, Grade)
2. Click "Save Student"
3. See the new student appear in the table
4. Try Edit and Delete buttons

**That's it! You're running! 🎉**

## 📚 Common Tasks

### Add a New Student Programmatically

```javascript
const student = {
  name: "Alice Johnson",
  email: "alice@example.com",
  course: "Advanced Mathematics",
  grade: 92
};

fetch('/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(student)
})
.then(res => res.json())
.then(data => console.log('Created:', data));
```

### Run Tests
```bash
npm test
```
Expected output:
```
Test Suites: 3 passed, 3 total
Tests:       67 passed, 67 total
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```
Tests re-run when you save files. Perfect for development!

### View Student Data
```bash
cat data/students.json
```

### Reset Data (Delete All Students)
```bash
rm data/students.json
# Restart server to recreate empty file
npm start
```

## 🔧 Development Workflow

### 1. Make Code Changes
Edit files in `lib/`, `public/`, or `server.js`

### 2. Run Tests Locally
```bash
npm test
```
Ensure all 67 tests pass before committing.

### 3. Test in Browser
```bash
npm start
```
Visit http://localhost:3000 and test manually.

### 4. Commit & Push
```bash
git add .
git commit -m "feature: add new student validation"
git push origin main
```

### 5. GitHub Actions Runs Automatically
- CI/CD workflow triggers
- Tests run on Node 16, 18, 20
- Results show in Actions tab

## 📁 File Structure Quick Reference

```
Key Files for Development:

server.js              ← Main application entry
lib/
├── dataStore.js      ← Database operations (CRUD)
├── routes.js         ← API endpoints (/api/students)
└── validation.js     ← Input validation & error handling

public/
├── index.html        ← UI markup
├── styles.css        ← UI styling
└── app.js            ← Frontend fetch API calls

__tests__/
├── dataStore.test.js
├── validation.test.js
└── routes.test.js    ← 67 unit & integration tests

data/
└── students.json     ← Auto-created data file
```

## 🔍 Debugging Tips

### Check Server Logs
```bash
npm start
# Look for errors in the output
```

### Browser Console
Press `F12` in browser → Console tab to see:
- JavaScript errors
- Network requests
- API responses

### API Testing with cURL
```bash
# Get all students
curl http://localhost:3000/api/students

# Create student
curl -X POST http://localhost:3000/api/students \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@test.com","course":"Math","grade":80}'

# Delete student
curl -X DELETE http://localhost:3000/api/students/1234567890
```

### Port Already in Use?
```bash
# Use different port
PORT=3001 npm start

# Or kill existing process
lsof -i :3000          # Find PID
kill -9 <PID>          # Kill it
npm start
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm install` completes without errors
- [ ] `npm start` runs on port 3000
- [ ] Browser opens to http://localhost:3000
- [ ] Form displays and is interactive
- [ ] Can create a student
- [ ] Can edit a student
- [ ] Can delete a student
- [ ] `npm test` passes all 67 tests
- [ ] No errors in browser console (F12)
- [ ] `git status` shows clean working directory

## 🌐 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

## 🚀 Next Steps

### Learn the Code
1. Read [README.md](README.md) - Full documentation
2. Read [TESTING.md](TESTING.md) - Testing guide
3. Check [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) - CI/CD setup

### Make Modifications
- Edit `public/styles.css` to change colors/layout
- Edit `public/app.js` to add new form fields
- Edit `lib/validation.js` to add new validation rules
- Run tests after each change: `npm test`

### Deploy
- [Heroku](https://www.heroku.com/) - Free hosting with `git push heroku main`
- [Railway](https://railway.app/) - Similar to Heroku
- [AWS](https://aws.amazon.com/), [GCP](https://cloud.google.com/), [Azure](https://azure.microsoft.com/) - Enterprise options

## 📞 Need Help?

### Common Issues & Solutions

**Q: Server won't start**
- Check if port 3000 is in use: `lsof -i :3000`
- Try a different port: `PORT=3001 npm start`

**Q: Tests fail after I made changes**
- Review error message carefully
- Run test in watch mode: `npm run test:watch`
- Add test for your new code

**Q: Data not saving**
- Check `data/students.json` exists
- Check file permissions: `ls -la data/`
- Check console for errors

**Q: Frontend not loading**
- Check browser console (F12) for JavaScript errors
- Verify server is running: `npm start` should show port 3000
- Try hard refresh: `Ctrl+Shift+R` (or Cmd+Shift+R on Mac)

**Q: How do I add a new field (like phone number)?**
1. Update validation in `lib/validation.js`
2. Update HTML form in `public/index.html`
3. Update frontend logic in `public/app.js`
4. Add API response handling
5. Write tests for new field
6. Run `npm test` to verify

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com/
- **Jest Testing**: https://jestjs.io/
- **REST APIs**: https://restfulapi.net/
- **JavaScript Fetch**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **GitHub Actions**: https://github.com/features/actions

## 💪 You're Ready!

You now have:
- ✅ Working application
- ✅ Full test suite
- ✅ Automated CI/CD
- ✅ Professional code structure
- ✅ Complete documentation

**Happy coding! 🚀**

---

**Next:** Read [README.md](README.md) for full API documentation and features.
