# GitHub Setup Guide

This guide will help you set up the project on GitHub.

## Initial Setup (Already Done ✅)

The project has been initialized with Git and is ready to be pushed to GitHub.

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI
```bash
# Install GitHub CLI if not already installed
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create mobile-product-check --public --source=. --remote=origin --push
```

### Option B: Using GitHub Web Interface

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `mobile-product-check`
   - **Description:** `React Native module for Syngenta product authentication using QR code scanning`
   - **Visibility:** Public (or Private)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository on GitHub, run:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mobile-product-check.git

# Or if using Syngenta organization:
git remote add origin https://github.com/syngenta/mobile-product-check.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Configure GitHub Settings

### 3.1 Add Repository Description
1. Go to your repository on GitHub
2. Click the ⚙️ icon next to "About"
3. Add description: "React Native module for Syngenta product authentication using QR code scanning"
4. Add topics: `react-native`, `qr-scanner`, `product-verification`, `syngenta`, `mobile`, `typescript`

### 3.2 Enable GitHub Actions
GitHub Actions are already configured! They will run automatically on push/PR.

### 3.3 Add NPM Token (for automatic publishing)
1. Go to Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Your NPM automation token
5. Click "Add secret"

### 3.4 Enable Branch Protection (Recommended)
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Select "test" and "coverage" checks

## Step 4: Add Badges to README

After pushing, add these badges to the top of README.md:

```markdown
# @syngenta/mobile-product-check

[![npm version](https://badge.fury.io/js/%40syngenta%2Fmobile-product-check.svg)](https://www.npmjs.com/package/@syngenta/mobile-product-check)
[![CI](https://github.com/syngenta/mobile-product-check/workflows/CI/badge.svg)](https://github.com/syngenta/mobile-product-check/actions)
[![codecov](https://codecov.io/gh/syngenta/mobile-product-check/branch/main/graph/badge.svg)](https://codecov.io/gh/syngenta/mobile-product-check)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
```

## Step 5: Create First Release

### Using GitHub CLI
```bash
# Create a tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release
gh release create v1.0.0 --title "v1.0.0 - Initial Release" --notes-file CHANGELOG.md
```

### Using GitHub Web Interface
1. Go to Releases → Draft a new release
2. Choose tag: `v1.0.0` (create new tag)
3. Release title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG.md
5. Click "Publish release"

This will automatically trigger the NPM publish workflow!

## Step 6: Enable GitHub Pages (Optional)

To host documentation:

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `docs` folder
4. Click Save

## GitHub Features Included

### ✅ GitHub Actions Workflows
- **CI Pipeline** (`.github/workflows/ci.yml`)
  - Runs on push and PR
  - Tests on Node 16, 18, 20
  - Linting, type checking, testing
  - Build verification
  - Code coverage

- **NPM Publish** (`.github/workflows/publish.yml`)
  - Runs on release creation
  - Automated testing and building
  - Automatic NPM publishing

### ✅ Issue Templates
- **Bug Report** - Structured bug reporting
- **Feature Request** - Feature suggestions

### ✅ Pull Request Template
- Standardized PR descriptions
- Checklist for contributors
- Type of change categorization

## Repository Structure on GitHub

```
mobile-product-check/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── publish.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── src/
├── examples/
├── __tests__/
├── docs/
└── ... (other files)
```

## Collaboration Features

### For Contributors
1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests locally
5. Submit pull request
6. GitHub Actions will automatically test your PR

### For Maintainers
1. Review PRs with CI results
2. Merge when tests pass
3. Create releases to trigger NPM publish
4. Monitor GitHub Actions for issues

## Useful Commands

```bash
# View current remote
git remote -v

# Create a new branch
git checkout -b feature/your-feature

# Push branch to GitHub
git push origin feature/your-feature

# View workflow runs
gh run list

# View workflow logs
gh run view

# Create release
gh release create v1.0.1 --generate-notes
```

## Security Best Practices

1. **Never commit sensitive data**
   - API keys
   - Tokens
   - Passwords

2. **Use GitHub Secrets for CI/CD**
   - Store NPM_TOKEN as secret
   - Use in workflows only

3. **Enable Dependabot**
   - Go to Settings → Security & analysis
   - Enable Dependabot alerts
   - Enable Dependabot security updates

4. **Enable Code Scanning** (if available)
   - Go to Security → Code scanning
   - Set up CodeQL analysis

## Monitoring

### Watch for:
- Failed CI builds
- Security alerts
- Dependency updates
- Community contributions
- Issue reports

### GitHub Insights
- View traffic stats
- Monitor popular content
- Track clones and views
- Analyze contribution activity

## Next Steps

1. ✅ Push to GitHub
2. ✅ Configure repository settings
3. ✅ Create first release
4. ✅ Publish to NPM
5. ✅ Add badges to README
6. ✅ Announce release
7. ✅ Monitor issues and PRs

## Support

If you need help:
- Check [GitHub Docs](https://docs.github.com)
- Open an issue
- Contact maintainers

---

**Your repository is ready for GitHub! 🚀**

Execute the commands above to push your code to GitHub and start collaborating!
