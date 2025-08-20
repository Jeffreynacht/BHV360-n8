#!/bin/bash

# BHV360 Deployment Script voor Jeffrey Nachtegaal
# Automated deployment to GitHub + Vercel

echo "🚀 BHV360 Deployment Starting..."
echo "👤 User: Jeffrey Nachtegaal"
echo "📅 Date: $(date)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

echo "✅ Project directory confirmed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful"

# Git setup
echo "📦 Setting up Git repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git initialized"
fi

# Add all files
git add .

# Commit
git commit -m "🚀 BHV360 Production Deployment - Jeffrey Nachtegaal $(date '+%Y-%m-%d %H:%M')"

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    git remote add origin https://github.com/Jeffreynacht/bhv360.git
    echo "✅ GitHub remote added"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Repository: https://github.com/Jeffreynacht/bhv360"
else
    echo "❌ Failed to push to GitHub. Please check your credentials."
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Go to: https://vercel.com/new"
echo "2. Import: Jeffreynacht/bhv360"
echo "3. Add environment variables (see .env.local)"
echo "4. Deploy!"
echo ""
echo "🔑 Environment Variables for Vercel:"
echo "NEXT_PUBLIC_SUPABASE_URL=https://ybxmvuzgqevqpusimgmm.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDk4NDEsImV4cCI6MjA2NjMyNTg0MX0.MFB7ytqPId2c3HEm5KyK2RFZCO-cBrpmiO-FwHJXSv4"
echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieG12dXpncWV2cXB1c2ltZ21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc0OTg0MSwiZXhwIjoyMDY2MzI1ODQxfQ.9sDOiFEbnx4hn69ay6P9J-YTaC_2DTBWiFSGRDul7dI"
echo "AUTH_PASSWORD=demo123"
echo "JWT_SECRET=bhv360-jeffrey-super-secure-jwt-secret-2025-production-ready-amsterdam"
echo "NEXT_PUBLIC_APP_URL=https://bhv360-jeffrey.vercel.app"
echo ""
echo "🎯 Ready to go live!"
