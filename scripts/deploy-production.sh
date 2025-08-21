#!/bin/bash

# BHV360 Production Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 BHV360 Production Deployment"
echo "================================"
echo ""

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please use Node.js 18 or higher."
    exit 1
fi

print_status "Node.js version $(node -v) is compatible"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm version $(npm -v) found"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if this is the BHV360 project
if ! grep -q "bhv360" package.json; then
    print_warning "This doesn't appear to be the BHV360 project. Continuing anyway..."
fi

print_status "Project directory verified"

# Check for required environment variables
print_info "Checking environment variables..."

REQUIRED_VARS=("DATABASE_URL" "NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_info "Please set these variables and try again."
    print_info "You can create a .env.local file with these variables."
    exit 1
fi

print_status "All required environment variables are set"

# Install dependencies
print_info "Installing dependencies..."
npm ci

print_status "Dependencies installed"

# Run type check
print_info "Running type check..."
if npm run type-check; then
    print_status "Type check passed"
else
    print_error "Type check failed. Please fix TypeScript errors and try again."
    exit 1
fi

# Build the application
print_info "Building application for production..."
if npm run build; then
    print_status "Build completed successfully"
else
    print_error "Build failed. Please check the errors above and try again."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_info "Installing Vercel CLI..."
    npm install -g vercel
    print_status "Vercel CLI installed"
else
    print_status "Vercel CLI found ($(vercel --version))"
fi

# Check Vercel authentication
print_info "Checking Vercel authentication..."
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami)
    print_status "Authenticated as: $VERCEL_USER"
else
    print_info "Please login to Vercel..."
    vercel login
fi

# Commit any uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected. Committing them..."
    git add .
    git commit -m "Production deployment $(date +%Y%m%d-%H%M%S)"
    print_status "Changes committed"
else
    print_status "Working directory is clean"
fi

# Deploy to Vercel
print_info "Deploying to Vercel production..."
echo ""
echo "🚀 Starting deployment..."
echo ""

if vercel --prod --yes; then
    print_status "Deployment completed successfully!"
else
    print_error "Deployment failed. Please check the errors above."
    exit 1
fi

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --meta | grep "bhv360" | head -1 | awk '{print $2}')
if [ -z "$DEPLOYMENT_URL" ]; then
    DEPLOYMENT_URL="https://bhv360.vercel.app"
fi

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "========================="
echo ""
echo "🔗 Your BHV360 application is now live at:"
echo "   $DEPLOYMENT_URL"
echo ""
echo "📋 Next Steps:"
echo "   1. Test the application thoroughly"
echo "   2. Configure custom domain (optional)"
echo "   3. Set up monitoring and analytics"
echo "   4. Review security settings"
echo ""
echo "📚 Demo Account:"
echo "   Email: demo@bhv360.nl"
echo "   Password: [Set during first login]"
echo ""
echo "🎯 Happy BHV managing! 🚀"
echo ""

# Create deployment summary
DEPLOYMENT_TIME=$(date +"%Y-%m-%d %H:%M:%S")
cat > deployment-summary.txt << EOF
BHV360 Production Deployment Summary
===================================

Deployment Time: $DEPLOYMENT_TIME
Deployment URL: $DEPLOYMENT_URL
Node.js Version: $(node -v)
npm Version: $(npm -v)
Vercel User: $(vercel whoami 2>/dev/null || echo "Unknown")

Status: SUCCESS ✅

Next Steps:
- Test application functionality
- Configure custom domain (optional)
- Set up monitoring
- Review security settings

Demo Account:
- Email: demo@bhv360.nl
- Password: [Set during first login]
EOF

print_status "Deployment summary saved to deployment-summary.txt"
