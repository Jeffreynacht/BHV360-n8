#!/bin/bash

echo "🔧 Fixing PNPM lockfile issues..."

# Enable corepack and set PNPM version
echo "📦 Setting up PNPM 10..."
corepack enable
corepack use pnpm@10

# Remove existing lockfile and node_modules
echo "🧹 Cleaning existing files..."
rm -rf node_modules pnpm-lock.yaml

# Fresh install with PNPM 10
echo "⬇️ Fresh install with PNPM 10..."
pnpm install

# Verify the installation
echo "✅ Verifying installation..."
pnpm list --depth=0

echo "🎉 Lockfile fixed! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. git add pnpm-lock.yaml package.json"
echo "2. git commit -m 'chore: sync pnpm-lock.yaml and add prebuild guard'"
echo "3. git push origin main"
