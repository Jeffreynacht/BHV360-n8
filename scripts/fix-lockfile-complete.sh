#!/bin/bash
set -e

echo "🔧 Starting complete deployment fix..."

# Step 1: Clean up dependencies
echo "📦 Cleaning up node_modules and lockfile..."
rm -rf node_modules
rm -f pnpm-lock.yaml

# Step 2: Setup pnpm
echo "🛠️ Setting up pnpm..."
corepack enable
corepack use pnpm@10

# Step 3: Install dependencies
echo "📥 Installing dependencies..."
pnpm install

# Step 4: Validate modules
echo "✅ Validating module exports..."
node scripts/validate-modules.mjs

# Step 5: Test build
echo "🏗️ Testing build..."
pnpm run build

echo "✅ Complete fix applied successfully!"
echo ""
echo "Next steps:"
echo "1. git add package.json pnpm-lock.yaml components/ui/sheet.tsx lib/modules/ scripts/ .npmrc vercel.json .env.example"
echo "2. git commit -m 'fix: remove @radix-ui/react-sheet, pin deps, sync lockfile, stable module exports, env hygiene, prebuild guard'"
echo "3. git push origin main"
echo "4. Redeploy on Vercel with Clear Cache + Use latest Project Settings"
