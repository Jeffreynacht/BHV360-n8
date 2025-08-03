#!/bin/bash

echo "🎯 BHV360 Live Testing Setup"
echo "============================"

# Make scripts executable
chmod +x scripts/*.sh

# Check dependencies
echo "📦 Checking dependencies..."
if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install fswatch for file watching (macOS/Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v fswatch &> /dev/null; then
        echo "📦 Installing fswatch..."
        brew install fswatch
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if ! command -v fswatch &> /dev/null; then
        echo "📦 Installing fswatch..."
        sudo apt-get update && sudo apt-get install fswatch
    fi
fi

# Setup git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - BHV360 setup"
fi

# Login to Vercel
echo "🔐 Vercel login..."
vercel whoami || vercel login

# Initial deployment
echo "🚀 Initial deployment..."
vercel --prod

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Copy your live URL from above"
echo "2. Run: npm run watch-deploy (for auto-deploy)"
echo "3. Run: npm run dev (for local development)"
echo "4. Start testing with real customers!"
echo ""
echo "📱 Live Testing Commands:"
echo "- npm run live          # Quick deploy"
echo "- npm run watch-deploy  # Auto-deploy on changes"
echo "- npm run dev          # Local development"
