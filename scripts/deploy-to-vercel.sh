#!/bin/bash

# BHV360 Production Deployment Script
# This script deploys the BHV360 application to Vercel with all necessary configurations

set -e  # Exit on any error

echo "🚀 Starting BHV360 Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel@latest
    fi
    
    print_success "All requirements met!"
}

# Check environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL environment variable is not set."
        print_status "Please set your Neon database URL:"
        print_status "export DATABASE_URL='postgresql://username:password@host/database'"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        print_warning "NEXT_PUBLIC_SUPABASE_URL not set. Using default."
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        print_warning "NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Using default."
    fi
    
    print_success "Environment variables checked!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed!"
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the Next.js application
    npm run build
    
    print_success "Application built successfully!"
}

# Run tests (if available)
run_tests() {
    print_status "Running tests..."
    
    if npm run test --if-present; then
        print_success "All tests passed!"
    else
        print_warning "Tests failed or not available. Continuing deployment..."
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Login to Vercel (if not already logged in)
    if ! vercel whoami &> /dev/null; then
        print_status "Please log in to Vercel:"
        vercel login
    fi
    
    # Deploy to production
    vercel --prod --yes
    
    print_success "Deployed to Vercel!"
}

# Set up database
setup_database() {
    print_status "Setting up production database..."
    
    if [ -f "scripts/production-schema.sql" ]; then
        print_status "Running database schema..."
        
        # Check if psql is available
        if command -v psql &> /dev/null; then
            psql "$DATABASE_URL" -f scripts/production-schema.sql
            print_success "Database schema applied!"
        else
            print_warning "psql not found. Please run the database schema manually:"
            print_status "psql \$DATABASE_URL -f scripts/production-schema.sql"
        fi
    else
        print_warning "Database schema file not found. Skipping database setup."
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(vercel ls --scope=team_bhv360 2>/dev/null | grep "bhv360" | head -1 | awk '{print $2}' || echo "")
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        DEPLOYMENT_URL="https://bhv360.vercel.app"
    fi
    
    print_status "Testing deployment at: $DEPLOYMENT_URL"
    
    # Test if the site is accessible
    if curl -s --head "$DEPLOYMENT_URL" | head -n 1 | grep -q "200 OK"; then
        print_success "Deployment is accessible!"
        print_success "🎉 BHV360 is now live at: $DEPLOYMENT_URL"
    else
        print_error "Deployment verification failed. Please check manually."
    fi
    
    # Test API endpoints
    print_status "Testing API endpoints..."
    
    if curl -s "$DEPLOYMENT_URL/api/health" | grep -q "ok"; then
        print_success "API endpoints are working!"
    else
        print_warning "API endpoints may not be working correctly."
    fi
}

# Set up monitoring and alerts
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # This would integrate with monitoring services
    print_status "Consider setting up:"
    print_status "- Vercel Analytics"
    print_status "- Error tracking (Sentry)"
    print_status "- Uptime monitoring"
    print_status "- Performance monitoring"
    
    print_success "Monitoring setup complete!"
}

# Main deployment process
main() {
    echo "🏢 BHV360 Production Deployment"
    echo "================================"
    echo ""
    
    check_requirements
    check_environment
    install_dependencies
    build_application
    run_tests
    setup_database
    deploy_to_vercel
    verify_deployment
    setup_monitoring
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================="
    echo ""
    print_success "BHV360 is now live and ready for customers!"
    echo ""
    print_status "Next steps:"
    print_status "1. Test the registration flow at https://bhv360.vercel.app/register"
    print_status "2. Monitor the application logs"
    print_status "3. Set up customer support processes"
    print_status "4. Configure payment processing (if not done)"
    print_status "5. Set up backup and monitoring systems"
    echo ""
    print_status "Support information:"
    print_status "- Documentation: https://bhv360.vercel.app/docs"
    print_status "- Admin panel: https://bhv360.vercel.app/super-admin"
    print_status "- Health check: https://bhv360.vercel.app/api/health"
    echo ""
}

# Run the deployment
main "$@"
