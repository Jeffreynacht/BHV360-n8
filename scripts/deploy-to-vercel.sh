#!/bin/bash

# BHV360 Vercel Deployment Script
# Versie: 2.1.0
# Datum: December 2024

set -e

echo "🚀 Starting BHV360 deployment to Vercel..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Clean and install dependencies
echo "🧹 Cleaning and installing dependencies..."
rm -rf node_modules
rm -rf .next
npm ci

# Run type checking
echo "🔍 Running TypeScript checks..."
npm run type-check || {
    echo "❌ TypeScript errors found. Please fix them before deploying."
    exit 1
}

# Run linting
echo "🔍 Running ESLint checks..."
npm run lint || {
    echo "⚠️  Linting warnings found, but continuing with deployment..."
}

# Build the project locally to catch any build errors
echo "🏗️  Building project locally..."
npm run build || {
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
}

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

# Get deployment URL
echo "🔍 Getting deployment URL..."
DEPLOYMENT_URL=$(vercel ls | head -2 | tail -1 | awk '{print $2}')

echo "================================================"
echo "✅ Deployment completed successfully!"
echo "🌐 Production URL: https://bhv360.vercel.app"
echo "🔗 Latest deployment: $DEPLOYMENT_URL"
echo "================================================"

# Run post-deployment checks
echo "🔍 Running post-deployment verification..."

# Wait for deployment to be ready
echo "⏳ Waiting 30 seconds for deployment to be ready..."
sleep 30

# Check if the site is accessible
echo "🌐 Testing homepage accessibility..."
if curl -f -s "https://bhv360.vercel.app" > /dev/null; then
    echo "✅ Site is accessible"
else
    echo "❌ Site is not accessible"
    exit 1
fi

# Check if login page loads
echo "🔐 Testing login page..."
if curl -f -s "https://bhv360.vercel.app/login" > /dev/null; then
    echo "✅ Login page is accessible"
else
    echo "❌ Login page is not accessible"
fi

# Check if mobile app page loads
echo "📱 Testing mobile app page..."
if curl -f -s "https://bhv360.vercel.app/mobile-app" > /dev/null; then
    echo "✅ Mobile app page is accessible"
else
    echo "❌ Mobile app page is not accessible"
fi

# Check API health
echo "🔧 Testing API health..."
if curl -f -s "https://bhv360.vercel.app/api/test-database" > /dev/null; then
    echo "✅ API is responding"
else
    echo "⚠️  API may not be responding correctly"
fi

echo "================================================"
echo "🎉 Deployment verification completed!"
echo "📋 Please run manual tests using the checklist below:"
echo ""
echo "Manual Testing Checklist:"
echo "□ Test logo display on login page"
echo "□ Test login functionality"
echo "□ Test website builder in super admin"
echo "□ Test mobile app page functionality"
echo "□ Test responsive design on mobile"
echo "□ Test all navigation links"
echo "□ Verify no service keys exposed on client"
echo "□ Test database connectivity"
echo "□ Test image loading and optimization"
echo "================================================"

echo "🔗 Quick Test Links:"
echo "• Homepage: https://bhv360.vercel.app"
echo "• Login: https://bhv360.vercel.app/login"
echo "• Mobile App: https://bhv360.vercel.app/mobile-app"
echo "• Platform: https://bhv360.vercel.app/platform"
echo "• Super Admin: https://bhv360.vercel.app/super-admin"
echo "• Website Builder: https://bhv360.vercel.app/super-admin/website-builder"
echo "================================================"
