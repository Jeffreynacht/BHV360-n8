#!/bin/bash

echo "🚀 BHV360 Quick Setup Commands"
echo "=============================="

echo ""
echo "📦 1. Install Dependencies"
npm install

echo ""
echo "🔧 2. Run Setup Wizard"
npm run setup:wizard

echo ""
echo "✅ 3. Available Commands After Setup:"
echo "npm run dev          # Start development server"
echo "npm run test:db      # Test database connection"
echo "npm run build        # Build for production"
echo "npm run deploy:check # Full deployment check"

echo ""
echo "🎯 Next: Follow the instructions from the setup wizard!"
