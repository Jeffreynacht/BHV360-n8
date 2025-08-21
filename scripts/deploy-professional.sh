#!/bin/bash

# BHV360 Professional Homepage Deployment Script
# Versie: v2.0.0-professional
# Datum: December 2024

set -e

echo "🚀 BHV360 Professional Homepage Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_status "Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_status "npm is installed"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found, installing..."
    npm install -g vercel
fi
print_status "Vercel CLI is available"

# 2. Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
print_status "Dependencies installed"

# 3. Check required files
echo ""
echo "📁 Checking required files..."

required_files=(
    "app/page.tsx"
    "app/register/page.tsx" 
    "app/platform/page.tsx"
    "public/images/bhv360-logo-full.png"
    "package.json"
    "next.config.mjs"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
    print_status "Found: $file"
done

# 4. Run linting (if available)
echo ""
echo "🔍 Running code quality checks..."
if npm run lint --silent 2>/dev/null; then
    print_status "Linting passed"
else
    print_warning "Linting not available or failed, continuing..."
fi

# 5. Build the application
echo ""
echo "🔨 Building application..."
npm run build
print_status "Build completed successfully"

# 6. Run deployment verification
echo ""
echo "🧪 Running deployment verification..."

# Check if homepage contains correct elements
if grep -q "Moderne BHV" app/page.tsx; then
    print_status "Homepage title correct"
else
    print_error "Homepage title missing or incorrect"
    exit 1
fi

if grep -q "info@bhv360.nl" app/page.tsx; then
    print_status "Contact email present"
else
    print_error "Contact email missing"
    exit 1
fi

if grep -q "033 461 6303" app/page.tsx; then
    print_status "Phone number present"
else
    print_error "Phone number missing"
    exit 1
fi

# 7. Deploy to Vercel
echo ""
echo "🌐 Deploying to Vercel..."
vercel --prod --yes

# 8. Post-deployment summary
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo ""
print_info "Deployment Details:"
echo "• Version: v2.0.0-professional"
echo "• Description: Volledig professionele en betrouwbare homepage"
echo "• Date: $(date)"
echo ""
print_info "Key Changes Deployed:"
echo "✅ Verwijderd: White label uit Starter plan"
echo "✅ Verwijderd: Valse garantie claims"
echo "✅ Verwijderd: 24/7 support (vervangen door ma-vr 09:00-16:00)"
echo "✅ Gecorrigeerd: Compliance van 'Gecertificeerd' naar 'Voldoet aan'"
echo "✅ Toegevoegd: Inlogknop in plaats van 'Platform'"
echo "✅ Toegevoegd: Volledige registratiepagina"
echo "✅ Verbeterd: Professionele call-to-actions"
echo "✅ Verbeterd: Realistische pricing"
echo "✅ Toegevoegd: Prominente contactgegevens"
echo "✅ Verbeterd: 3x groter logo"
echo ""
print_info "Website Details:"
echo "🌍 URL: https://bhv360.nl"
echo "📧 Email: info@bhv360.nl"
echo "📞 Phone: 033 461 6303"
echo "🏢 Address: Fokkerstraat 16, 3833LD Leusden"
echo ""
print_info "Please verify the following:"
echo "• Homepage loads without errors"
echo "• Registration page works correctly"
echo "• All links navigate to correct pages"
echo "• Mobile responsiveness works"
echo "• No false claims or misleading information"
echo "• Compliance correctly displayed"
echo "• Contact information visible everywhere"
echo "• Call-to-actions lead to correct actions"
echo ""
print_status "Professional BHV360 homepage is now LIVE! 🚀"
