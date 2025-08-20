#!/bin/bash

echo "🤖 BHV360 Auto-Deploy Watcher"
echo "=============================="

# Check if fswatch is available
if ! command -v fswatch &> /dev/null; then
    echo "📦 Installing file watcher..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install fswatch
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install fswatch
    else
        echo "❌ Please install fswatch manually for your system"
        exit 1
    fi
fi

# Function to deploy
deploy() {
    echo "🔄 Changes detected, deploying..."
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to git (if remote exists)
    if git remote get-url origin &> /dev/null; then
        git push origin main
    fi
    
    # Deploy to Vercel
    vercel --prod --yes
    
    echo "✅ Deploy complete at $(date '+%H:%M:%S')"
    echo "🔄 Watching for more changes..."
}

# Initial message
echo "👀 Watching for file changes..."
echo "💡 Make changes to your files and they'll auto-deploy!"
echo "🛑 Press Ctrl+C to stop watching"
echo ""

# Watch for changes in key directories
fswatch -o \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vercel' \
    app/ components/ lib/ styles/ public/ | while read f; do
    deploy
done
