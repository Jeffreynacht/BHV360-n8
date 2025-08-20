#!/bin/bash

echo "⚡ BHV360 Instant Deploy"
echo "======================="

# Quick validation
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Quick build test
echo "🔨 Quick build test..."
if ! npm run build > /dev/null 2>&1; then
    echo "❌ Build failed. Please fix errors first."
    npm run build
    exit 1
fi

# Git operations (if git repo exists)
if [ -d ".git" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Instant deploy: $(date '+%Y-%m-%d %H:%M:%S')" --quiet
    
    # Push if remote exists
    if git remote get-url origin &> /dev/null; then
        echo "📤 Pushing to git..."
        git push origin main --quiet
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ INSTANT DEPLOY COMPLETE!"
echo "⏱️  Total time: ~30 seconds"
echo "🌐 Your changes are now live!"
echo ""
echo "💡 Pro tip: Use 'npm run watch-deploy' for automatic deployment"
