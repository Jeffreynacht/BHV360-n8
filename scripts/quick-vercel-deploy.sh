#!/bin/bash

echo "🚀 BHV360 Quick Vercel Deploy"
echo "=============================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel if not already logged in
echo "🔐 Checking Vercel login..."
vercel whoami || vercel login

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live!"
echo ""
echo "Next steps:"
echo "1. Copy the production URL"
echo "2. Test all functionality"
echo "3. Add custom domain if needed"
