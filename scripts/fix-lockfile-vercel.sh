#!/bin/bash

echo "🔧 Fixing PNPM lockfile for Vercel deployment..."

# Step 1: Clean everything
echo "🧹 Cleaning existing files..."
rm -rf node_modules pnpm-lock.yaml

# Step 2: Enable corepack and set PNPM version
echo "📦 Setting up PNPM 10.2.0..."
corepack enable
corepack use pnpm@10.2.0

# Step 3: Install with no frozen lockfile (like Vercel will do)
echo "⬇️ Installing with --no-frozen-lockfile..."
pnpm install --no-frozen-lockfile

# Step 4: Verify the build works
echo "🔨 Testing build..."
pnpm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed"
    exit 1
fi

# Step 5: Test the validation script
echo "✅ Testing module validation..."
node scripts/validate-modules.mjs
if [ $? -ne 0 ]; then
    echo "❌ Module validation failed"
    exit 1
fi

echo "🎉 Lockfile fixed and validated!"
echo ""
echo "📝 Next steps:"
echo "1. git add ."
echo "2. git commit -m 'fix: resolve pnpm lockfile mismatch and add module validation'"
echo "3. git push origin main"
echo ""
echo "🚀 Vercel should now deploy successfully with:"
echo "   installCommand: pnpm install --no-frozen-lockfile"
