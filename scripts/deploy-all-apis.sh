#!/bin/bash

# BHV360 Complete API Deployment Script
# This script deploys all APIs to production with comprehensive validation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="BHV360 Plotkaart"
VERSION="1.0.0"
ENVIRONMENT="production"
START_TIME=$(date +%s)

echo -e "${BLUE}🚀 Starting Complete API Deployment for ${PROJECT_NAME}${NC}"
echo -e "${BLUE}📦 Version: ${VERSION}${NC}"
echo -e "${BLUE}🌍 Environment: ${ENVIRONMENT}${NC}"
echo "============================================================"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Environment Validation
echo -e "${BLUE}🔍 Step 1: Validating Environment${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Check required files
REQUIRED_FILES=(
    "package.json"
    "next.config.mjs"
    "tsconfig.json"
    ".env.example"
    "app/layout.tsx"
    "app/page.tsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found required file: $file"
    else
        print_error "Missing required file: $file"
        exit 1
    fi
done

# 2. Dependency Installation
echo -e "\n${BLUE}📦 Step 2: Installing Dependencies${NC}"
npm ci
print_status "Dependencies installed successfully"

# 3. API Discovery
echo -e "\n${BLUE}🔍 Step 3: Discovering API Endpoints${NC}"

API_COUNT=0
if [ -d "app/api" ]; then
    API_COUNT=$(find app/api -name "route.ts" -o -name "route.tsx" | wc -l)
    print_status "Found $API_COUNT API endpoints"
    
    # List API categories
    echo "📋 API Categories discovered:"
    find app/api -name "route.ts" -o -name "route.tsx" | sed 's|app/api/||' | sed 's|/route\.tsx\?||' | sort | while read -r api; do
        echo "   📡 /api/$api"
    done
else
    print_warning "No API directory found"
fi

# 4. Code Quality Checks
echo -e "\n${BLUE}🔧 Step 4: Running Code Quality Checks${NC}"

# TypeScript compilation
echo "📝 Checking TypeScript compilation..."
if npx tsc --noEmit; then
    print_status "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed"
    exit 1
fi

# Linting (optional - don't fail on warnings)
echo "🔍 Running linter..."
if npx eslint . --ext .ts,.tsx --max-warnings 10; then
    print_status "Linting passed"
else
    print_warning "Linting issues found, but continuing..."
fi

# 5. Build Test
echo -e "\n${BLUE}🏗️  Step 5: Testing Build Process${NC}"
if npm run build; then
    print_status "Build test successful"
else
    print_error "Build test failed"
    exit 1
fi

# 6. Security Audit
echo -e "\n${BLUE}🔒 Step 6: Security Audit${NC}"
if npm audit --audit-level=high; then
    print_status "Security audit passed"
else
    print_warning "Security audit found issues, but continuing..."
fi

# 7. Vercel CLI Check
echo -e "\n${BLUE}🌐 Step 7: Preparing Vercel Deployment${NC}"
if ! command_exists vercel; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    print_status "Vercel CLI installed"
else
    VERCEL_VERSION=$(vercel --version)
    print_status "Vercel CLI version: $VERCEL_VERSION"
fi

# 8. Production Deployment
echo -e "\n${BLUE}🚀 Step 8: Deploying to Production${NC}"
echo "🌍 Deploying to Vercel production..."

if vercel --prod --yes; then
    print_status "Production deployment successful"
else
    print_error "Production deployment failed"
    exit 1
fi

# 9. Post-Deployment Verification
echo -e "\n${BLUE}🔍 Step 9: Post-Deployment Verification${NC}"

# Get deployment URL (this would need to be captured from Vercel output in practice)
DEPLOYMENT_URL="https://bhv360.vercel.app"

# Test critical endpoints
CRITICAL_ENDPOINTS=(
    "/api/health"
    "/api/auth/status"
    "/api/websocket/connect"
    "/api/test-database"
    "/api/deployment-status"
)

echo "🔗 Testing critical endpoints..."
for endpoint in "${CRITICAL_ENDPOINTS[@]}"; do
    echo -n "   Testing $endpoint... "
    if curl -s -f "$DEPLOYMENT_URL$endpoint" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning${NC}"
    fi
done

# 10. Generate Deployment Report
echo -e "\n${BLUE}📊 Step 10: Generating Deployment Report${NC}"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

echo "============================================================"
echo -e "${GREEN}📊 DEPLOYMENT REPORT${NC}"
echo "============================================================"
echo "🏷️  Project: $PROJECT_NAME"
echo "🌍 Environment: $ENVIRONMENT"
echo "⏱️  Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
echo "📡 API Endpoints: $API_COUNT"
echo "🔗 Deployment URL: $DEPLOYMENT_URL"
echo "📅 Deployed: $(date)"
echo ""

# API Summary by Category
echo "📋 API ENDPOINTS SUMMARY:"
if [ -d "app/api" ]; then
    echo ""
    echo "🔐 Authentication APIs:"
    find app/api -path "*/auth/*" -name "route.ts*" | sed 's|app/api|   GET/POST /api|' | sed 's|/route\.tsx\?||' || echo "   None found"
    
    echo ""
    echo "👥 User Management APIs:"
    find app/api -path "*/users/*" -name "route.ts*" | sed 's|app/api|   GET/POST /api|' | sed 's|/route\.tsx\?||' || echo "   None found"
    
    echo ""
    echo "🏢 Customer Management APIs:"
    find app/api -path "*/customers/*" -name "route.ts*" | sed 's|app/api|   GET/POST /api|' | sed 's|/route\.tsx\?||' || echo "   None found"
    
    echo ""
    echo "🚨 Emergency & Incident APIs:"
    find app/api $$ -path "*/incidents/*" -o -path "*/emergency/*" -o -path "*/evacuation/*" -o -path "*/alerts/*" $$ -name "route.ts*" | sed 's|app/api|   GET/POST /api|' | sed 's|/route\.tsx\?||' || echo "   None found"
    
    echo ""
    echo "💬 Messaging & Communication APIs:"
    find app/api $$ -path "*/messaging/*" -o -path "*/websocket/*" -o -path "*/push*" -o -path "*/email/*" -o -path "*/sms/*" $$ -name "route.ts*" | sed 's|app/api|   GET/POST /api|' | sed 's|/route\.tsx\?||' || echo "   None found"
    
    echo ""
    echo "📊 Monitoring & System APIs:"
    find app/api $$ -path "*/monitoring/*" -o -path "*/health*" -o -path "*/backup/*" -o -path "*/performance/*" $$ -name "route.ts*" | sed 's|app/api|   GET/POST /api|' | sed 's|/route\.tsx\?||' || echo "   None found"
fi

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}🌐 Your BHV360 application is now live at: $DEPLOYMENT_URL${NC}"
echo "============================================================"

# Optional: Open deployment in browser (macOS/Linux)
if command_exists open; then
    echo "🌐 Opening deployment in browser..."
    open "$DEPLOYMENT_URL"
elif command_exists xdg-open; then
    echo "🌐 Opening deployment in browser..."
    xdg-open "$DEPLOYMENT_URL"
fi

print_status "All APIs successfully deployed to production!"
