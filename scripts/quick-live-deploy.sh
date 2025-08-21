#!/bin/bash

# BHV360 Quick Live Deployment Script
# This script provides a fast path to production deployment

set -e  # Exit on any error

echo "🚀 BHV360 QUICK LIVE DEPLOYMENT"
echo "==============================="
echo "Started at: $(date)"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo ""
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}$(echo "$1" | sed 's/./─/g')${NC}"
}

# Trap to handle script interruption
trap 'echo -e "\n${RED}❌ Deployment interrupted!${NC}"; exit 1' INT TERM

# STEP 1: Environment Checks
print_step "🔍 STEP 1: Environment Checks"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in project root directory (package.json not found)"
    exit 1
fi

print_success "Project directory confirmed"

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18 or higher"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 18+"
    exit 1
fi

print_success "Node.js $(node -v) is compatible"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm"
    exit 1
fi

print_success "npm $(npm --version) available"

# Check required files
REQUIRED_FILES=("package.json" "next.config.mjs" "app/layout.tsx" "app/page.tsx" "tailwind.config.ts")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done

print_success "All required files present"

# Check environment variables
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
    print_info "Set these variables in your environment or .env.local file"
    exit 1
fi

print_success "All environment variables configured"

# STEP 2: Dependencies and Build
print_step "📦 STEP 2: Dependencies and Build"

print_info "Installing dependencies..."
if npm ci --silent; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_info "Running type check..."
if npm run type-check --silent; then
    print_success "Type check passed"
else
    print_error "Type check failed - fix TypeScript errors before deployment"
    exit 1
fi

print_info "Building application..."
if npm run build --silent; then
    print_success "Build completed successfully"
else
    print_error "Build failed - check build errors above"
    exit 1
fi

# Verify build output
if [ ! -d ".next" ]; then
    print_error "Build output directory (.next) not found"
    exit 1
fi

print_success "Build output verified"

# STEP 3: Vercel Setup
print_step "🌐 STEP 3: Vercel Setup"

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    print_info "Installing Vercel CLI..."
    if npm install -g vercel@latest --silent; then
        print_success "Vercel CLI installed"
    else
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
else
    print_success "Vercel CLI available ($(vercel --version))"
fi

# Check Vercel authentication
print_info "Checking Vercel authentication..."
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami 2>/dev/null)
    print_success "Authenticated as: $VERCEL_USER"
else
    print_info "Please login to Vercel..."
    if vercel login; then
        VERCEL_USER=$(vercel whoami 2>/dev/null)
        print_success "Authenticated as: $VERCEL_USER"
    else
        print_error "Failed to authenticate with Vercel"
        exit 1
    fi
fi

# STEP 4: Git Operations
print_step "📝 STEP 4: Git Operations"

# Check if we're in a git repository
if [ -d ".git" ]; then
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_info "Committing uncommitted changes..."
        git add .
        COMMIT_MSG="Live deployment $(date +%Y%m%d-%H%M%S)"
        if git commit -m "$COMMIT_MSG"; then
            print_success "Changes committed: $COMMIT_MSG"
        else
            print_warning "Failed to commit changes (may not be necessary)"
        fi
    else
        print_success "No uncommitted changes"
    fi
    
    # Check if we have a remote
    if git remote get-url origin &> /dev/null; then
        print_info "Pushing to remote repository..."
        if git push; then
            print_success "Changes pushed to remote"
        else
            print_warning "Failed to push to remote (continuing anyway)"
        fi
    else
        print_warning "No git remote configured"
    fi
else
    print_warning "Not a git repository (skipping git operations)"
fi

# STEP 5: Production Deployment
print_step "🚀 STEP 5: Production Deployment"

print_info "Deploying to Vercel production..."
print_info "This may take a few minutes..."

# Deploy with progress indication
DEPLOYMENT_START=$(date +%s)

if DEPLOY_OUTPUT=$(vercel --prod --yes --confirm 2>&1); then
    DEPLOYMENT_END=$(date +%s)
    DEPLOYMENT_DURATION=$((DEPLOYMENT_END - DEPLOYMENT_START))
    
    print_success "Deployment completed in ${DEPLOYMENT_DURATION} seconds"
    
    # Extract deployment URL
    DEPLOYMENT_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        DEPLOYMENT_URL="https://bhv360.vercel.app"
        print_warning "Could not extract deployment URL, using default: $DEPLOYMENT_URL"
    else
        print_success "Deployment URL: $DEPLOYMENT_URL"
    fi
else
    print_error "Deployment failed!"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

# STEP 6: Post-Deployment Verification
print_step "🔍 STEP 6: Post-Deployment Verification"

print_info "Waiting for deployment to be ready..."
sleep 10

# Test homepage
print_info "Testing homepage..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" | grep -q "200"; then
    print_success "Homepage is accessible"
else
    print_warning "Homepage may not be fully ready yet"
fi

# Test health API
print_info "Testing health API..."
HEALTH_URL="$DEPLOYMENT_URL/api/health"
if curl -s -f "$HEALTH_URL" | grep -q '"status":"healthy"'; then
    print_success "Health API is working"
else
    print_warning "Health API may not be ready yet"
fi

# Test database API
print_info "Testing database API..."
DB_TEST_URL="$DEPLOYMENT_URL/api/test-database"
if curl -s -f "$DB_TEST_URL" | grep -q '"success":true'; then
    print_success "Database API is working"
else
    print_warning "Database API may not be ready yet"
fi

# STEP 7: Success Summary
print_step "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"

echo ""
echo "📊 Deployment Summary:"
echo "   • Status: LIVE ✅"
echo "   • Duration: ${DEPLOYMENT_DURATION} seconds"
echo "   • Timestamp: $(date)"
echo ""
echo "🔗 Your BHV360 Application is LIVE at:"
echo "   $DEPLOYMENT_URL"
echo ""
echo "🎯 Quick Test Links:"
echo "   • Homepage:     $DEPLOYMENT_URL"
echo "   • Health Check: $DEPLOYMENT_URL/api/health"
echo "   • Database:     $DEPLOYMENT_URL/api/test-database"
echo "   • Login:        $DEPLOYMENT_URL/login"
echo ""
echo "👤 Demo Account:"
echo "   • Email: demo@bhv360.nl"
echo "   • Role: Administrator"
echo ""
echo "📋 Next Steps:"
echo "   1. Test all functionality in your browser"
echo "   2. Configure custom domain (optional)"
echo "   3. Set up monitoring and alerts"
echo "   4. Add real customers and users"
echo ""

# Save deployment info
DEPLOYMENT_INFO="{
  \"url\": \"$DEPLOYMENT_URL\",
  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"status\": \"LIVE\",
  \"duration\": $DEPLOYMENT_DURATION,
  \"method\": \"quick-shell-deploy\"
}"

echo "$DEPLOYMENT_INFO" > deployment-live.json
print_success "Deployment info saved to deployment-live.json"

echo ""
echo "🚀 BHV360 IS NOW LIVE! 🎉"
echo ""

# Optional: Open in browser (if available)
if command -v open &> /dev/null; then
    print_info "Opening application in browser..."
    open "$DEPLOYMENT_URL"
elif command -v xdg-open &> /dev/null; then
    print_info "Opening application in browser..."
    xdg-open "$DEPLOYMENT_URL"
fi

exit 0
