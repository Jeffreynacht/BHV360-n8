#!/bin/bash

echo "🚀 Installing Vercel CLI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install Vercel CLI globally
echo "📦 Installing Vercel CLI globally..."
npm install -g vercel

# Check if installation was successful
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installed successfully!"
    echo "📋 Version: $(vercel --version)"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Run: vercel login"
    echo "2. Run: vercel link"
    echo "3. Run: vercel domains add www.bhv360.nl"
else
    echo "❌ Vercel CLI installation failed."
    echo "Try running with sudo (Mac/Linux) or as Administrator (Windows)"
fi
