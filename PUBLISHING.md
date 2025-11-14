# Publishing Guide

This guide explains how to publish the @syngenta/mobile-product-check package to NPM.

## Prerequisites

1. NPM account with publish permissions
2. Access to the @syngenta scope (or use your own scope)
3. Git repository set up with proper remote
4. All tests passing

## Pre-Publish Checklist

- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version number is updated in package.json
- [ ] Examples are working
- [ ] README.md is complete

## Publishing Steps

### 1. Login to NPM

```bash
npm login
```

### 2. Update Version

Follow semantic versioning:

- **Patch** (1.0.x): Bug fixes, minor changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

This will:
- Update package.json version
- Create a git tag
- Run preversion and postversion scripts

### 3. Review Changes

```bash
# Check what will be published
npm pack --dry-run

# Review the package contents
npm pack
tar -xvzf *.tgz
rm -rf package *.tgz
```

### 4. Build the Package

```bash
npm run build
```

### 5. Test the Package Locally

```bash
# In this project
npm pack

# In a test project
npm install /path/to/syngenta-mobile-product-check-1.0.0.tgz
```

### 6. Publish to NPM

```bash
# For public package
npm publish --access public

# For scoped package with restricted access
npm publish --access restricted
```

### 7. Verify Publication

```bash
# Check on NPM
npm info @syngenta/mobile-product-check

# Install in a test project
npm install @syngenta/mobile-product-check
```

### 8. Create GitHub Release

```bash
# Push tags
git push origin main --tags

# Create release on GitHub with changelog
```

## Publishing Beta/Alpha Versions

For pre-release versions:

```bash
# Update version with tag
npm version prerelease --preid=beta

# Publish with tag
npm publish --tag beta
```

Users can install with:
```bash
npm install @syngenta/mobile-product-check@beta
```

## Automated Publishing (CI/CD)

### Using GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Unpublishing (Emergency Only)

⚠️ Only unpublish if absolutely necessary (security issues, major bugs)

```bash
# Unpublish specific version
npm unpublish @syngenta/mobile-product-check@1.0.0

# Unpublish entire package (within 72 hours of publish)
npm unpublish @syngenta/mobile-product-check --force
```

## Deprecating Versions

Instead of unpublishing, deprecate old versions:

```bash
npm deprecate @syngenta/mobile-product-check@1.0.0 "This version has critical bugs. Please upgrade to 1.0.1+"
```

## Post-Publish Tasks

1. **Update Documentation**
   - Update README badges
   - Update installation instructions
   - Update changelog

2. **Announce Release**
   - Post on GitHub Discussions
   - Update project website
   - Notify stakeholders

3. **Monitor Issues**
   - Watch for bug reports
   - Monitor npm downloads
   - Check compatibility issues

## Troubleshooting

### "You do not have permission to publish"

- Ensure you're logged in: `npm whoami`
- Check package scope permissions
- Verify organization membership

### "Package name already exists"

- Choose a different package name
- Use a scoped package: `@yourscope/package-name`

### "Version already exists"

- Update version number: `npm version patch`
- Cannot republish same version

### Build Errors

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Best Practices

1. **Test Before Publishing**
   - Run all tests
   - Test in a sample project
   - Check on different platforms (iOS/Android)

2. **Semantic Versioning**
   - Follow semver strictly
   - Document breaking changes
   - Provide migration guides

3. **Documentation**
   - Keep README up to date
   - Update API documentation
   - Maintain changelog

4. **Communication**
   - Announce breaking changes
   - Provide upgrade paths
   - Respond to issues promptly

5. **Security**
   - Use npm automation tokens
   - Enable 2FA on npm account
   - Review dependencies regularly

## Support

For publishing issues:
- NPM Support: https://www.npmjs.com/support
- GitHub Issues: https://github.com/syngenta/mobile-product-check/issues
