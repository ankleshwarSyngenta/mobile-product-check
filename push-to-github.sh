#!/bin/bash

# GitHub Push Script for mobile-product-check
# This script helps you push your code to GitHub

echo "🚀 GitHub Push Helper"
echo "===================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized!"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Check current status
echo "📊 Current Status:"
git status --short
echo ""

# Ask for GitHub username/organization
read -p "Enter GitHub username or organization (e.g., syngenta): " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username is required!"
    exit 1
fi

# Repository name
REPO_NAME="mobile-product-check"

# Full GitHub URL
GITHUB_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "📍 Repository URL: $GITHUB_URL"
echo ""

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "Current remote: $CURRENT_REMOTE"
    echo ""
    read -p "Do you want to update it? (y/n): " UPDATE_REMOTE
    
    if [ "$UPDATE_REMOTE" = "y" ] || [ "$UPDATE_REMOTE" = "Y" ]; then
        git remote set-url origin $GITHUB_URL
        echo "✅ Remote updated to: $GITHUB_URL"
    fi
else
    git remote add origin $GITHUB_URL
    echo "✅ Remote 'origin' added: $GITHUB_URL"
fi

echo ""
echo "🔄 Preparing to push..."
echo ""

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Current branch is '$CURRENT_BRANCH', switching to 'main'..."
    git checkout -b main 2>/dev/null || git checkout main
fi

echo "✅ On branch: main"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your repository is now on GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Visit: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "2. Add repository description and topics"
    echo "3. Configure GitHub Actions secrets (NPM_TOKEN)"
    echo "4. Create your first release to trigger NPM publish"
    echo ""
    echo "To create a release:"
    echo "  git tag -a v1.0.0 -m 'Release v1.0.0'"
    echo "  git push origin v1.0.0"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "This might mean:"
    echo "1. Repository doesn't exist on GitHub yet"
    echo "   → Create it at: https://github.com/new"
    echo ""
    echo "2. You don't have permission"
    echo "   → Check your GitHub authentication"
    echo ""
    echo "3. You need to authenticate"
    echo "   → Try: gh auth login"
    echo ""
    exit 1
fi
