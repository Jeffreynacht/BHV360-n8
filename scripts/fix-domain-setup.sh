#!/bin/bash

echo "🌐 BHV360 Domain Setup Fix Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel if needed
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Check current Vercel domains
echo "📋 Checking current Vercel domains..."
vercel domains ls

echo ""
echo "🔧 Adding missing domains to Vercel..."

# Add www.bhv360.nl if not exists
echo "Adding www.bhv360.nl..."
vercel domains add www.bhv360.nl --redirect bhv360.nl

# Add bhv360.com if not exists  
echo "Adding bhv360.com..."
vercel domains add bhv360.com --redirect bhv360.nl

# Add www.bhv360.com if not exists
echo "Adding www.bhv360.com..."
vercel domains add www.bhv360.com --redirect bhv360.nl

echo ""
echo "✅ Domain setup complete!"
echo ""
echo "📋 DNS Records needed in Strato:"
echo "================================"
echo "A Record:    bhv360.nl     → 76.76.19.19"
echo "CNAME:       www           → bhv360.nl"
echo ""
echo "📋 If you own bhv360.com, add these DNS records:"
echo "A Record:    bhv360.com    → 76.76.19.19" 
echo "CNAME:       www           → bhv360.com"
echo ""
echo "⏳ DNS propagation takes 1-24 hours"
echo "🔍 Test with: nslookup www.bhv360.nl"
