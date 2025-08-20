#!/bin/bash

# BHV360 Quick Start Script
# Dit script helpt je snel aan de slag

echo "🚀 BHV360 Quick Start"
echo "====================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is niet geïnstalleerd"
    echo "   Download van: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is niet geïnstalleerd"
    exit 1
fi

echo "✅ Node.js en npm zijn geïnstalleerd"

# Install dependencies
echo "📦 Dependencies installeren..."
npm install

# Make scripts executable
chmod +x scripts/*.sh
chmod +x deploy.sh 2>/dev/null || true

echo ""
echo "🎯 Volgende stappen:"
echo "1. Maak een Supabase project aan op https://supabase.com"
echo "2. Voer 'npm run setup' uit om de configuratie wizard te starten"
echo "3. Voer 'npm run validate' uit om je setup te controleren"
echo "4. Voer 'npm run deploy' uit om live te gaan"
echo ""
echo "💡 Tip: Voer 'npm run dev' uit om lokaal te testen"
