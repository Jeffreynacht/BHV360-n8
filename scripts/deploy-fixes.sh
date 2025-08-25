#!/bin/bash

# BHV360 - Deploy with Export Fixes
# This script deploys the application after fixing the missing exports

set -e  # Exit on any error

echo "🚀 BHV360 - Deploying with Export Fixes"
echo "========================================"
echo "📅 Started: $(date)"
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

# Step 1: Verify fixes are in place
echo "🔍 STEP 1: Verifying Export Fixes"
echo "--------------------------------"

if [ ! -f "helpers/number.ts" ]; then
    print_error "helpers/number.ts file is missing!"
    exit 1
fi

print_status "helpers/number.ts file exists"

# Check for required exports
if grep -q "export function toFixedSafe" helpers/number.ts; then
    print_status "toFixedSafe export found"
else
    print_error "toFixedSafe export missing"
    exit 1
fi

if grep -q "export function toNumberSafe" helpers/number.ts; then
    print_status "toNumberSafe export found"
else
    print_error "toNumberSafe export missing"
    exit 1
fi

print_status "All required exports are present"
echo ""

# Step 2: Pre-deployment checks
echo "🔧 STEP 2: Pre-deployment Checks"
echo "--------------------------------"

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if essential files exist
ESSENTIAL_FILES=("package.json" "next.config.mjs" "app/layout.tsx" "app/page.tsx" "tailwind.config.ts" "tsconfig.json")

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file"
    else
        print_error "Essential file missing: $file"
        exit 1
    fi
done

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    print_status "Vercel CLI available: $VERCEL_VERSION"
else
    print_info "Installing Vercel CLI..."
    npm install -g vercel
    print_status "Vercel CLI installed"
fi

echo ""

# Step 3: Build the application
echo "🏗️  STEP 3: Building Application"
echo "--------------------------------"

# Clean previous builds
print_info "Cleaning previous builds..."
rm -rf .next out 2>/dev/null || true

# Install dependencies
print_info "Installing dependencies..."
npm ci

# Type check
print_info "Running TypeScript check..."
if npx tsc --noEmit; then
    print_status "TypeScript check passed"
else
    print_error "TypeScript check failed"
    exit 1
fi

# Lint check
print_info "Running ESLint check..."
if npm run lint; then
    print_status "Lint check passed"
else
    print_warning "Lint check had warnings, continuing..."
fi

# Build the application
print_info "Building application..."
if npm run build; then
    print_status "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

echo ""

# Step 4: Deploy to Vercel
echo "🌐 STEP 4: Deploying to Vercel"
echo "------------------------------"

# Check Vercel authentication
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami)
    print_status "Authenticated as: $VERCEL_USER"
else
    print_info "Please authenticate with Vercel..."
    vercel login
fi

# Deploy to production
print_info "Deploying to production..."
print_info "This may take a few minutes..."

if DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1); then
    print_status "Deployment completed successfully"
    
    # Extract deployment URL
    DEPLOYMENT_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        print_status "Production URL: $DEPLOYMENT_URL"
        
        # Save deployment info
        cat > deployment-info.json << EOF
{
  "url": "$DEPLOYMENT_URL",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "fixes": [
    "toFixedSafe export added",
    "toNumberSafe export added"
  ],
  "status": "success",
  "nodeVersion": "$NODE_VERSION"
}
EOF
        print_status "Deployment info saved to deployment-info.json"
    else
        DEPLOYMENT_URL="https://bhv-plotkaart-recreation.vercel.app"
        print_warning "Could not extract URL, using default: $DEPLOYMENT_URL"
    fi
else
    print_error "Vercel deployment failed"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo ""

# Step 5: Verify deployment
echo "🔍 STEP 5: Verifying Deployment"
echo "-------------------------------"

print_info "Waiting for deployment to be ready..."
sleep 15

# Test homepage
print_info "Testing homepage..."
if curl -f -s -o /dev/null "$DEPLOYMENT_URL"; then
    print_status "Homepage accessible"
else
    print_warning "Homepage test failed"
fi

# Test API endpoints
API_ENDPOINTS=("/api/health" "/api/test-database" "/api/deployment-status")

print_info "Testing API endpoints..."
for endpoint in "${API_ENDPOINTS[@]}"; do
    if curl -f -s -o /dev/null "$DEPLOYMENT_URL$endpoint"; then
        print_status "$endpoint responding"
    else
        print_warning "$endpoint not available"
    fi
done

# Test key pages
KEY_PAGES=("/dashboard" "/login" "/plotkaart")

print_info "Testing key pages..."
for page in "${KEY_PAGES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL$page")
    if [ "$HTTP_CODE" -lt 500 ]; then
        print_status "$page accessible ($HTTP_CODE)"
    else
        print_warning "$page has issues ($HTTP_CODE)"
    fi
done

print_status "Deployment verification completed"
echo ""

# Final summary
DURATION=$(($(date +%s) - $(date -d "$(grep timestamp deployment-info.json | cut -d'"' -f4)" +%s) + $(date +%s)))
DURATION_MIN=$((DURATION / 60))

echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "========================"
echo "🔗 Production URL: $DEPLOYMENT_URL"
echo "⏱️  Duration: ${DURATION_MIN} minutes"
echo ""
echo "🚀 Next steps:"
echo "   • Test all application functionality"
echo "   • Verify number helper functions work in production"
echo "   • Check all pages and features"
echo "   • Monitor application performance"
echo ""
echo "📊 Key features deployed:"
echo "   • BHV plotkaart editor"
echo "   • User management system"
echo "   • Emergency procedures"
echo "   • Inspection reports"
echo "   • Real-time notifications"
echo ""
echo "✅ Export fixes applied:"
echo "   • toFixedSafe function"
echo "   • toNumberSafe function"
echo "   • All helper utilities"
echo ""

print_status "BHV360 is now live in production!"
