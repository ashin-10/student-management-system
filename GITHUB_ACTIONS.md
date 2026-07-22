# GitHub Actions CI/CD Workflow

This project includes an automated GitHub Actions workflow that runs tests on every push and pull request.

## 📋 Workflow Overview

**File:** `.github/workflows/test.yml`

### Triggers
The workflow runs when:
- Code is pushed to `main` or `develop` branches
- A pull request is opened or updated targeting `main` or `develop`

### Matrix Testing
Tests run on multiple Node.js versions to ensure compatibility:
- **Node.js 16.x** (LTS)
- **Node.js 18.x** (LTS)
- **Node.js 20.x** (Latest LTS)

## 🔧 Workflow Steps

### 1. **Checkout Code**
   - Uses `actions/checkout@v4` to clone the repository

### 2. **Setup Node.js**
   - Uses `actions/setup-node@v4`
   - Installs the specified Node.js version
   - Uses NPM cache for faster builds

### 3. **Install Dependencies**
   - Runs `npm ci` (clean install)
   - Uses cached dependencies when available
   - Faster and more reliable than `npm install`

### 4. **Syntax Check**
   - Validates JavaScript syntax using `node -c`
   - Checks all main files:
     - `server.js`
     - `lib/dataStore.js`
     - `lib/routes.js`
     - `lib/validation.js`

### 5. **Run Tests**
   - Executes `npm test -- --coverage`
   - Runs Jest with coverage reporting
   - All 67 tests must pass
   - Coverage metrics are generated

### 6. **Upload Coverage**
   - Uses `codecov/codecov-action@v3`
   - Uploads coverage reports to Codecov
   - Optional: Fails if upload errors occur
   - Provides badge for README

### 7. **Test Summary**
   - Creates a summary in the GitHub Actions UI
   - Shows pass/fail status
   - Accessible from Actions tab

## 📊 Example Workflow Run

```
✅ Checkout code
✅ Setup Node.js 18.x
✅ Install dependencies
✅ Check syntax
✅ Run tests (67 passed)
✅ Upload coverage
✅ Test Summary
```

**Total time:** ~30-60 seconds per Node.js version

## 🔍 Viewing Results

### In GitHub Actions Tab

1. Go to repository → **Actions** tab
2. Click on the latest workflow run
3. See detailed logs for each step
4. Check which Node.js versions passed/failed

### In Pull Request

When you create a PR, you'll see:
- ✅ All checks passed (green checkmark)
- 📊 Coverage report comment
- 🔗 Links to detailed logs

### Failed Builds

If tests fail:
1. Click on the failed job
2. Scroll to the failing step
3. Read error output
4. Fix locally: `npm test`
5. Push again to re-run

## 🛠️ Configuration Details

### Cache Strategy
```yaml
cache: 'npm'
```
- Caches `node_modules/` between runs
- Saves 20-30 seconds per workflow
- Automatically invalidated when `package.json` changes

### Node.js Versions
```yaml
matrix:
  node-version: [16.x, 18.x, 20.x]
```
- Tests against multiple versions
- Ensures broad compatibility
- Catches version-specific issues

## 📈 Coverage Reports

Coverage metrics are collected and can be viewed:

```bash
# Locally
npm test -- --coverage
cd coverage
open lcov-report/index.html  # macOS
start lcov-report/index.html # Windows
```

**Coverage Thresholds (from jest.config.js):**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🚦 Status Badges

Add this to your README.md to show CI status:

```markdown
[![Tests](https://github.com/ashin-10/student-management-system/actions/workflows/test.yml/badge.svg)](https://github.com/ashin-10/student-management-system/actions/workflows/test.yml)
```

## 🔐 Secrets & Environment Variables

Currently, no secrets are required. If you add deployment later:

1. Go to **Settings** → **Secrets and variables**
2. Click **New repository secret**
3. Add variables like:
   - `DEPLOY_TOKEN`
   - `DB_URL`
   - `API_KEY`

Use in workflow:
```yaml
- name: Deploy
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
  run: npm run deploy
```

## 📝 Customization Guide

### Run tests on different events
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### Run only on main branch
```yaml
on:
  push:
    branches: [main]
```

### Add additional Node versions
```yaml
matrix:
  node-version: [14.x, 16.x, 18.x, 20.x]
```

### Add deployment step
```yaml
- name: Deploy to Heroku
  if: github.ref == 'refs/heads/main' && success()
  run: |
    git remote add heroku https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/your-app.git
    git push heroku main
```

### Add code quality checks
```yaml
- name: Lint code
  run: npm run lint

- name: Check formatting
  run: npm run format:check
```

## ⚡ Performance Tips

1. **Use `npm ci` instead of `npm install`**
   - Already in workflow
   - ~20% faster, more reliable

2. **Cache dependencies**
   - Already configured
   - Saves setup time

3. **Parallel matrix testing**
   - Tests run on multiple Node versions simultaneously
   - Doesn't block on single version failures

4. **Use GitHub-hosted runners**
   - `ubuntu-latest` is fast and free
   - No need for self-hosted runners

## 🐛 Troubleshooting

### Workflow stuck in pending
- Check Actions tab for status
- May be queue delay during heavy GitHub load
- Usually resolves in a few minutes

### Tests pass locally but fail in CI
1. Check Node.js version: `node --version`
2. Clear cache: Delete `.npm` in workflow
3. Install fresh: Run `npm ci` locally
4. Check OS-specific issues

### Coverage drops below threshold
1. Add tests for new code
2. Check `coverage/lcov-report/index.html` locally
3. Run `npm test -- --coverage` for report
4. Fix untested code paths

### Dependency issues
1. Check `package-lock.json` is committed
2. Verify no version conflicts in `package.json`
3. Test with: `npm ci && npm test`

## 📚 Related Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/)
- [Codecov Guide](https://docs.codecov.io/)
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)

## 🎯 Next Steps

1. **Push code to GitHub** to trigger first workflow run
2. **Check Actions tab** to see results
3. **Add badge** to README.md
4. **Monitor coverage** trends
5. **Customize workflow** as needed

## 💡 Pro Tips

- Check workflow file syntax: `.github/workflows/test.yml`
- Use `git commit -m "fix: resolve test failure"` for conventional commits
- Tag releases: `git tag v1.0.0 && git push origin v1.0.0`
- Use branch protection rules to require passing tests

---

**Your CI/CD pipeline is ready! 🚀**
