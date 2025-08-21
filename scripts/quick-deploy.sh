#!/bin/bash

echo "⚡ BHV360 Quick Deploy"
echo "===================="

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

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    print_status "All requirements met!"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_status "Dependencies installed!"
}

# Setup git repository
setup_git() {
    print_info "Setting up Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        print_status "Git repository initialized!"
    else
        print_warning "Git repository already exists"
    fi
    
    # Add all files
    git add .
    
    # Commit
    git commit -m "🚀 BHV360 platform - ready for deployment" || print_warning "Nothing to commit"
    
    print_status "Git setup complete!"
}

# Create environment file template
create_env_template() {
    print_info "Creating environment template..."
    
    cat > .env.example << EOF
# BHV360 Environment Configuration
# Copy to .env.local and fill in your values

# Database Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres

# Authentication (REQUIRED)
AUTH_PASSWORD=your-auth-password
JWT_SECRET=your-jwt-secret

# App Configuration (REQUIRED)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_DOMAIN=your-app.vercel.app

# Features (OPTIONAL)
NEXT_PUBLIC_ENABLE_BROWSER_NOTIFICATIONS=true
NEXT_PUBLIC_DEFAULT_PASSWORD=demo123

# Monitoring (OPTIONAL)
SLACK_WEBHOOK_URL=
SMTP_HOST=
EOF
    
    print_status "Environment template created!"
}

# Build the project
build_project() {
    print_info "Building project..."
    npm run build
    print_status "Project built successfully!"
}

# Main deployment function
main() {
    echo ""
    print_info "Starting BHV360 deployment process..."
    echo ""
    
    check_requirements
    install_dependencies
    create_env_template
    setup_git
    build_project
    
    echo "🚀 Deploying..."
    vercel --prod --yes
    
    echo ""
    print_status "🎉 BHV360 is ready for deployment!"
    echo ""
    print_info "Next steps:"
    echo "1. Create Supabase project at https://supabase.com"
    echo "2. Copy .env.example to .env.local and fill in your values"
    echo "3. Run the database schema in Supabase SQL Editor"
    echo "4. Push to GitHub and deploy to Vercel"
    echo ""
    print_info "Need help? Run: npm run go-live-wizard"
    echo "🧪 Test your deployment at /test-modules"
}

# Run main function
main
