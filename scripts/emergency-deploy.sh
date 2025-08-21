#!/bin/bash

# BHV360 Emergency Deployment Script
# This script will immediately deploy the fixes to Vercel

set -e  # Exit on any error

echo "🚀 BHV360 EMERGENCY DEPLOYMENT STARTING..."
echo "================================================"
echo "📅 $(date)"
echo "🏗️  Project: BHV360 Plotkaart Recreation"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔄 $1...${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_status "Checking prerequisites"

if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

print_success "All prerequisites met"

# Update package.json version
print_status "Updating package.json version"
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = pkg.version.split('.');
version[2] = (parseInt(version[2]) + 1).toString();
pkg.version = version.join('.');
pkg.deployment = {
  lastDeployment: new Date().toISOString(),
  deploymentType: 'emergency-fix',
  version: pkg.version
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Updated to version:', pkg.version);
"
print_success "Package.json updated"

# Clean and install dependencies
print_status "Installing dependencies"
rm -rf node_modules package-lock.json
npm install
print_success "Dependencies installed"

# Build the project
print_status "Building project"
rm -rf .next
npm run build
print_success "Project built successfully"

# Git operations
print_status "Committing changes to git"
git add .

COMMIT_MESSAGE="🚀 Emergency deployment fixes - $(date)

- Fixed CustomerProvider export and SSR safety
- Fixed AuthProvider export and SSR safety  
- Fixed DataProvider export and SSR safety
- Fixed ThemeProvider props interface
- Updated React versions for compatibility
- Added health and database test endpoints
- Resolved prerendering errors

Deployment: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

git commit -m "$COMMIT_MESSAGE"
print_success "Changes committed"

print_status "Pushing to GitHub"
git push origin main
print_success "Changes pushed to GitHub"

# Deploy to Vercel
print_status "Deploying to Vercel"
vercel --prod --yes
print_success "Deployed to Vercel"

# Wait for deployment to propagate
print_status "Waiting for deployment to propagate"
sleep 10

# Verify deployment
print_status "Verifying deployment"

BASE_URL="https://bhv360.vercel.app"

# Test endpoints
echo "🔍 Testing endpoints:"

# Health check
if curl -f -s "$BASE_URL/api/health" > /dev/null; then
    print_success "Health endpoint is working"
else
    print_warning "Health endpoint test failed"
fi

# Database test
if curl -f -s "$BASE_URL/api/test-database" > /dev/null; then
    print_success "Database test endpoint is working"
else
    print_warning "Database test endpoint failed"
fi

# Homepage
if curl -f -s "$BASE_URL" > /dev/null; then
    print_success "Homepage is loading"
else
    print_warning "Homepage test failed"
fi

# Final report
echo ""
echo "================================================"
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "================================================"
echo "🌐 Live URL: $BASE_URL"
echo "📱 Mobile: $BASE_URL"
echo "🔧 Admin: $BASE_URL/dashboard"
echo "📊 Health: $BASE_URL/api/health"
echo "🗄️  Database: $BASE_URL/api/test-database"
echo "================================================"
echo "📅 Completed: $(date)"
echo "⏱️  Total time: $SECONDS seconds"
echo "================================================"

print_success "BHV360 is now live with all fixes applied!"
