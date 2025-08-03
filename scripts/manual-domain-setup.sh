#!/bin/bash

echo "🌐 Manual Domain Setup for BHV360..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "🔐 Step 1: Login to Vercel"
vercel login

echo "🔗 Step 2: Link project"
vercel link

echo "🌍 Step 3: Adding domains..."

echo "Adding www.bhv360.nl..."
vercel domains add www.bhv360.nl

echo "Adding bhv360.com..."
vercel domains add bhv360.com

echo "Adding www.bhv360.com..."
vercel domains add www.bhv360.com

echo "📋 Step 4: List all domains"
vercel domains ls

echo "🚀 Step 5: Deploy to production"
vercel --prod

echo ""
echo "✅ Domain setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure DNS in Strato:"
echo "   - CNAME: www → cname.vercel-dns.com"
echo "2. Wait for DNS propagation (1-24 hours)"
echo "3. Test domains: www.bhv360.nl, bhv360.com"
