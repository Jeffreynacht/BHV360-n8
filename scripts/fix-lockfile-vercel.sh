#!/bin/bash

echo "🔧 BHV360 Deployment Fix Script"
echo "================================"

# Exit on any error
set -e

echo "📦 Step 1: Clean existing installation"
rm -rf node_modules
rm -f pnpm-lock.yaml

echo "🔧 Step 2: Setup PNPM 10.2.0"
corepack enable
corepack use pnpm@10.2.0

echo "📥 Step 3: Install dependencies (no frozen lockfile)"
pnpm install --no-frozen-lockfile

echo "🔍 Step 4: TypeScript check"
pnpm run type-check

echo "✅ Step 5: Validate module exports"
node scripts/validate-modules.mjs

echo "🏗️  Step 6: Test build"
pnpm run build

echo ""
echo "✅ SUCCESS! All checks passed."
echo "📋 Summary:"
echo "   - PNPM lockfile regenerated"
echo "   - TypeScript compilation: OK"
echo "   - Module exports validated: OK"
echo "   - Build test: OK"
echo ""
echo "🚀 Ready for Vercel deployment!"
echo "   Run: git add . && git commit -m 'fix: resolve deployment issues' && git push"
