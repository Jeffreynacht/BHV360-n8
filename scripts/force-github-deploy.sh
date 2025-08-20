#!/bin/bash

# 🚀 Force GitHub Deploy - Overschrijft bestaande repository
# WAARSCHUWING: Dit script overschrijft je bestaande GitHub repository!

set -e

echo "⚠️  FORCE GITHUB DEPLOYMENT"
echo "=========================="
echo ""
echo "🚨 WAARSCHUWING: Dit script zal je bestaande GitHub repository OVERSCHRIJVEN!"
echo "   Alle bestaande commits en geschiedenis gaan verloren."
echo ""
echo "Weet je zeker dat je wilt doorgaan? (type 'OVERSCHRIJVEN' om te bevestigen)"
read -r confirmation

if [ "$confirmation" != "OVERSCHRIJVEN" ]; then
    echo "❌ Deployment geannuleerd"
    exit 0
fi

# Get GitHub username
echo ""
echo "Voer je GitHub username in:"
read -r github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is verplicht!"
    exit 1
fi

repo_name="bhv-plotkaart-recreation"
repo_url="https://github.com/$github_username/$repo_name.git"

echo ""
echo "🎯 Repository die wordt overschreven:"
echo "   $repo_url"
echo ""
echo "Laatste kans om te stoppen. Doorgaan? (y/n)"
read -r final_confirm

if [ "$final_confirm" != "y" ] && [ "$final_confirm" != "Y" ]; then
    echo "❌ Deployment gestopt"
    exit 0
fi

# Remove existing .git directory
echo "🗑️  Removing existing Git history..."
rm -rf .git

# Initialize fresh Git repository
echo "🔧 Initializing fresh Git repository..."
git init

# Update package.json
echo "📝 Updating package.json..."
sed -i.bak "s|YOUR_USERNAME|$github_username|g" package.json
rm -f package.json.bak

# Add all files
echo "📁 Adding all files..."
git add .

# Initial commit
echo "💾 Creating fresh commit..."
git commit -m "Initial commit: BHV Plotkaart Recreation - Complete application

Features:
- ✅ Complete homepage with all sections
- ✅ Login system with demo accounts  
- ✅ User management with email functionality
- ✅ Interactive plotkaart editor
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Database integration
- ✅ API endpoints
- ✅ Production ready

Ready for Vercel deployment!"

# Add remote and force push
echo "🚀 Force pushing to GitHub..."
git remote add origin "$repo_url"
git branch -M main
git push -u origin main --force

echo ""
echo "✅ FORCE DEPLOYMENT SUCCESSFUL!"
echo "==============================="
echo ""
echo "🎉 Je repository is overschreven met de nieuwe code:"
echo "   https://github.com/$github_username/$repo_name"
echo ""
echo "🚀 Volgende stappen voor Vercel:"
echo "1. Ga naar: https://vercel.com/new"
echo "2. Import je GitHub repository"
echo "3. Configureer environment variables"
echo "4. Deploy!"
echo ""
echo "📋 Environment Variables voor Vercel:"
echo "DATABASE_URL=your_database_url"
echo "NEXTAUTH_SECRET=your_secret_key"
echo "NEXTAUTH_URL=https://your-app.vercel.app"
echo "NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app"
