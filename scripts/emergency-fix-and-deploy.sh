#!/bin/bash

echo "🚀 Starting Emergency Production Deployment..."

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

print_success() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting emergency deployment process..."

# 1. Clean up any existing build artifacts
print_status "Cleaning up build cache..."
rm -rf .next
rm -rf node_modules/.cache

# 2. Install dependencies
print_status "Installing dependencies..."
npm install

# 3. Run type checking
print_status "Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    print_error "TypeScript errors found. Please fix them before deploying."
    exit 1
fi

# 4. Build the application
print_status "Building application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the errors above."
    exit 1
fi

print_success "Build completed successfully!"

# 5. Deploy to Vercel
print_status "Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy with force flag to override any issues
vercel --prod --yes

if [ $? -eq 0 ]; then
    print_status "🎉 Deployment successful!"
    print_status "Your BHV360 application is now live with all fixes applied!"
    echo ""
    echo "✅ Fixed NextAuth v4 configuration"
    echo "✅ Fixed revalidate exports"
    echo "✅ Added dynamic exports for cookie/searchParams pages"
    echo "✅ Fixed toFixed null-checks"
    echo "✅ Updated package.json with correct engines"
    echo "✅ Fixed TypeScript errors"
    echo "✅ Added green-blue gradient tiles"
    echo ""
    print_status "🌐 Check your deployment at: https://your-domain.vercel.app"
else
    print_error "Deployment failed. Please check the Vercel logs."
    exit 1
fi

echo ""
print_success "Emergency deployment process completed!"
print_status "Check your Vercel dashboard for deployment status."
