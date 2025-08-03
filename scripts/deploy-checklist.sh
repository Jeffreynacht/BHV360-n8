#!/bin/bash

echo "🚀 BHV360 Deployment Checklist"
echo "================================"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ Environment file found"
else
    echo "❌ .env.local not found - create it first!"
    exit 1
fi

# Check if database connection works
echo "🔍 Testing database connection..."
npm run test:database

# Check if build works
echo "🔨 Testing build..."
npm run build

# Check if all required env vars are set
echo "🔍 Checking environment variables..."
if grep -q "DATABASE_URL" .env.local; then
    echo "✅ DATABASE_URL found"
else
    echo "❌ DATABASE_URL missing"
fi

if grep -q "NEXT_PUBLIC_DOMAIN" .env.local; then
    echo "✅ NEXT_PUBLIC_DOMAIN found"
else
    echo "❌ NEXT_PUBLIC_DOMAIN missing"
fi

echo ""
echo "🎯 Ready for deployment!"
echo "Next steps:"
echo "1. Push to GitHub"
echo "2. Deploy to Vercel"
echo "3. Add environment variables to Vercel"
echo "4. Wait for domain activation (tomorrow)"
