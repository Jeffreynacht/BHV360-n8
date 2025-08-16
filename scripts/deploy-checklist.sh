#!/bin/bash

echo "🚀 Pre-deployment checklist for Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the project root."
    exit 1
fi

echo "1. 🔍 Checking TypeScript compilation..."
if ! pnpm run type-check; then
    echo "❌ TypeScript errors found. Fix before deploying."
    exit 1
fi
echo "✅ TypeScript compilation passed"

echo "2. 🧩 Validating module exports..."
if ! node scripts/validate-modules.mjs; then
    echo "❌ Module validation failed. Check exports in lib/modules/module-definitions.ts"
    exit 1
fi
echo "✅ Module exports validated"

echo "3. 🏗️ Testing production build..."
if ! pnpm run build; then
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi
echo "✅ Production build successful"

echo "4. 🔒 Checking environment variable security..."
if grep -r "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*TOKEN" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules .; then
    echo "❌ Found potentially sensitive NEXT_PUBLIC_ variables. Review and move to server-only."
    exit 1
fi
echo "✅ No sensitive NEXT_PUBLIC_ variables found"

echo "5. 📦 Checking PNPM lockfile..."
if [ ! -f "pnpm-lock.yaml" ]; then
    echo "❌ pnpm-lock.yaml not found. Run 'pnpm install' first."
    exit 1
fi
echo "✅ PNPM lockfile present"

echo ""
echo "🎉 All checks passed! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. Commit any remaining changes"
echo "2. Push to main branch: git push origin main"
echo "3. Monitor Vercel deployment dashboard"
echo "4. Verify deployment at your domain"
