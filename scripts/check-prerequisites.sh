#!/bin/bash

echo "🔍 Checking prerequisites for BHV360 deployment..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found."
    exit 1
fi

# Check Vercel CLI
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    echo "✅ Vercel CLI: $VERCEL_VERSION"
else
    echo "⚠️  Vercel CLI not found. Run: npm install -g vercel"
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
else
    echo "⚠️  Git not found. Install from https://git-scm.com/"
fi

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."

if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL is set"
else
    echo "⚠️  DATABASE_URL not set"
fi

if [ -n "$NEXT_PUBLIC_STACK_PROJECT_ID" ]; then
    echo "✅ NEXT_PUBLIC_STACK_PROJECT_ID is set"
else
    echo "⚠️  NEXT_PUBLIC_STACK_PROJECT_ID not set"
fi

echo ""
echo "🎯 Prerequisites check complete!"
