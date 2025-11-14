# 📦 Complete Deployment Guide

This guide walks you through deploying the mobile-product-check package to GitHub and NPM.

## 📋 Pre-Deployment Checklist

- [x] All code is written and tested
- [x] Git repository initialized
- [x] Initial commits made
- [x] Documentation complete
- [x] GitHub workflows configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] NPM account ready
- [ ] Package published to NPM

## 🚀 Deployment Steps

### Step 1: Create GitHub Repository

#### Option A: Using the Helper Script (Easiest)

```bash
# Run the helper script
./push-to-github.sh
```

The script will:
- Check your Git status
- Ask for your GitHub username
- Set up the remote
- Push to GitHub

#### Option B: Using GitHub CLI

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Login
gh auth login

# Create and push repository
gh repo create mobile-product-check --public --source=. --push

# Or for private repo
gh repo create mobile-product-check --private --source=. --push
```

#### Option C: Manual Setup

1. **Create repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `mobile-product-check`
   - Description: "React Native module for Syngenta product authentication using QR code scanning"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code**
   ```bash
   # Add remote (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/mobile-product-check.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure GitHub Repository

1. **Add Topics**
   - Go to your repository
   - Click ⚙️ next to "About"
   - Add topics: `react-native`, `qr-scanner`, `product-verification`, `syngenta`, `mobile`, `typescript`, `authentication`

2. **Enable GitHub Actions** (automatic)
   - Actions are already configured
   - Will run automatically on push/PR

3. **Add NPM Token Secret**
   - Go to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your NPM automation token (see below)
   - Click "Add secret"

### Step 3: Get NPM Token

1. **Create NPM Account** (if you don't have one)
   ```bash
   npm adduser
   ```

2. **Get Automation Token**
   - Go to https://www.npmjs.com
   - Click your profile → Access Tokens
   - Generate New Token → Automation
   - Copy the token
   - Add it to GitHub secrets (see Step 2.3 above)

### Step 4: Publish to NPM

#### Option A: Manual Publish (First Time)

```bash
# Login to NPM
npm login

# Run tests
npm test

# Build the package
npm run build

# Publish (use your scope or remove @syngenta/)
npm publish --access public
```

#### Option B: Automatic Publish (via GitHub Release)

1. **Create a Git tag**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Create GitHub Release**
   
   Using GitHub CLI:
   ```bash
   gh release create v1.0.0 \
     --title "v1.0.0 - Initial Release" \
     --notes "$(cat CHANGELOG.md)"
   ```
   
   Or via GitHub web:
   - Go to: Code → Releases → Draft a new release
   - Choose tag: `v1.0.0`
   - Release title: `v1.0.0 - Initial Release`
   - Copy description from CHANGELOG.md
   - Click "Publish release"

3. **Monitor the Workflow**
   ```bash
   # Watch the publish workflow
   gh run watch
   
   # Or check on GitHub
   # Actions tab → Publish to NPM workflow
   ```

### Step 5: Verify Publication

```bash
# Check if package is published
npm info @syngenta/mobile-product-check

# Install in a test project
npm install @syngenta/mobile-product-check

# Check on NPM
# Visit: https://www.npmjs.com/package/@syngenta/mobile-product-check
```

### Step 6: Update README with Badges

Add badges to the top of README.md:

```markdown
[![npm version](https://badge.fury.io/js/%40syngenta%2Fmobile-product-check.svg)](https://www.npmjs.com/package/@syngenta/mobile-product-check)
[![CI](https://github.com/YOUR_USERNAME/mobile-product-check/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/mobile-product-check/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
```

Commit and push:
```bash
git add README.md
git commit -m "Add badges to README"
git push
```

## 🔄 Future Updates

### Publishing Updates

1. **Update version**
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Update CHANGELOG.md**
   - Add new version section
   - List all changes

3. **Create release**
   ```bash
   git push origin main --tags
   gh release create v1.0.1 --generate-notes
   ```

4. **Automatic publish**
   - GitHub Actions will automatically publish to NPM

## 🛡️ Security Best Practices

1. **Never commit secrets**
   - API keys
   - Tokens
   - Passwords

2. **Use GitHub Secrets**
   - Store NPM_TOKEN as secret
   - Never expose in logs

3. **Enable 2FA**
   - On NPM account
   - On GitHub account

4. **Review dependencies**
   ```bash
   npm audit
   npm audit fix
   ```

## 📊 Monitoring

### GitHub

- **Actions**: Monitor CI/CD workflows
- **Issues**: Track bugs and features
- **Pull Requests**: Review contributions
- **Insights**: View traffic and clones

### NPM

- **Downloads**: Check weekly downloads
- **Versions**: Monitor version adoption
- **Dependencies**: Check who depends on you

### Commands

```bash
# GitHub stats
gh repo view --web

# NPM stats
npm info @syngenta/mobile-product-check

# Check who uses your package
npm-stat @syngenta/mobile-product-check
```

## 🐛 Troubleshooting

### GitHub Push Failed

**Error**: `remote: Repository not found`

**Solution**:
1. Create repository on GitHub first
2. Check repository name spelling
3. Verify you have access

**Error**: `Authentication failed`

**Solution**:
```bash
# Login with GitHub CLI
gh auth login

# Or set up SSH keys
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### NPM Publish Failed

**Error**: `You do not have permission to publish`

**Solution**:
1. Login: `npm login`
2. Check package name availability
3. Use scoped package: `@yourscope/package-name`
4. Request access to @syngenta scope

**Error**: `Package name already exists`

**Solution**:
- Change package name in package.json
- Or use scope: `@yourname/mobile-product-check`

**Error**: `Version already exists`

**Solution**:
```bash
# Update version
npm version patch
git push origin main --tags
```

### GitHub Actions Failed

**Solution**:
1. Check workflow logs on GitHub
2. Verify NPM_TOKEN secret is set
3. Ensure all tests pass locally
4. Check Node.js version compatibility

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Code is on GitHub
- ✅ GitHub Actions pass
- ✅ Package is on NPM
- ✅ Installation works: `npm install @syngenta/mobile-product-check`
- ✅ Documentation is accessible
- ✅ Examples work correctly

## 📞 Support

### Get Help

- **GitHub Issues**: Report bugs or request features
- **NPM Support**: https://www.npmjs.com/support
- **GitHub Docs**: https://docs.github.com
- **Community**: Stack Overflow with tag `mobile-product-check`

### Quick Commands Reference

```bash
# Git
git status
git add .
git commit -m "message"
git push

# GitHub CLI
gh repo view
gh release create
gh run list

# NPM
npm login
npm test
npm run build
npm publish
npm version patch

# Package Info
npm info @syngenta/mobile-product-check
```

## 🎉 You're Done!

Your package is now:
- ✅ On GitHub for collaboration
- ✅ On NPM for distribution
- ✅ Automatically tested via CI
- ✅ Automatically published on release
- ✅ Ready for the world to use!

Share your package:
- Post on social media
- Add to Awesome React Native
- Write a blog post
- Create demo videos

**Congratulations! 🚀**

---

## Quick Command Summary

```bash
# 1. Push to GitHub
./push-to-github.sh

# 2. Add NPM token to GitHub secrets
# Do this in GitHub web interface

# 3. Create release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --generate-notes

# 4. Package automatically publishes to NPM via GitHub Actions!

# 5. Verify
npm info @syngenta/mobile-product-check
```

That's it! 🎊
