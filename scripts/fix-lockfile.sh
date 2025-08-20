#!/bin/bash

echo "🔧 Starting lockfile fix process..."

# Enable corepack and set PNPM version
echo "📦 Setting up PNPM 10.2.0..."
corepack enable
corepack use pnpm@10

# Clean existing installation
echo "🧹 Cleaning existing node_modules and lockfile..."
rm -rf node_modules pnpm-lock.yaml

# Fresh install
echo "⬇️ Installing dependencies with PNPM 10.2.0..."
pnpm install

# Validate TypeScript
echo "🔍 Running TypeScript check..."
pnpm run type-check

# Validate modules
echo "🧩 Validating module exports..."
node scripts/validate-modules.mjs

# Test build
echo "🏗️ Testing build..."
pnpm run build

echo "✅ Lockfile fix completed successfully!"
echo ""
echo "Next steps:"
echo "1. git add package.json pnpm-lock.yaml lib/modules/ scripts/ vercel.json .env.example"
echo "2. git commit -m 'fix: stable module exports + env hygiene + pnpm lockfile sync + prebuild guard'"
echo "3. git push origin main"
