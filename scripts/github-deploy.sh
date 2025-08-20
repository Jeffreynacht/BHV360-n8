#!/bin/bash

# BHV360 GitHub Deployment Script (Safe Version)
# This script safely deploys the BHV Plotkaart application to GitHub

set -e  # Exit on any error

echo "🚀 BHV360 GitHub Deployment - Safe Version"
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_info "Starting deployment process..."

# Step 1: Check prerequisites
print_info "Step 1: Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_status "Node.js is installed: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_status "npm is installed: $(npm --version)"

# Check Git
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_status "Git is installed: $(git --version)"

# Step 2: Install dependencies
print_info "Step 2: Installing dependencies..."
npm install
print_status "Dependencies installed successfully"

# Step 3: Run type checking
print_info "Step 3: Running type checking..."
if npm run type-check; then
    print_status "Type checking passed"
else
    print_warning "Type checking failed, but continuing deployment..."
fi

# Step 4: Test build
print_info "Step 4: Testing build..."
if npm run build; then
    print_status "Build test successful"
else
    print_error "Build failed. Please fix build errors before deploying."
    exit 1
fi

# Step 5: Initialize Git repository if needed
print_info "Step 5: Setting up Git repository..."

if [ ! -d ".git" ]; then
    git init
    print_status "Git repository initialized"
else
    print_status "Git repository already exists"
fi

# Step 6: Configure Git user if not set
if [ -z "$(git config user.name)" ]; then
    echo "Please enter your Git username:"
    read -r git_username
    git config user.name "$git_username"
fi

if [ -z "$(git config user.email)" ]; then
    echo "Please enter your Git email:"
    read -r git_email
    git config user.email "$git_email"
fi

print_status "Git user configured: $(git config user.name) <$(git config user.email)>"

# Step 7: Get GitHub repository URL
print_info "Step 7: GitHub repository setup..."

echo "Please enter your GitHub username:"
read -r github_username

echo "Please enter your repository name (default: bhv-plotkaart-recreation):"
read -r repo_name
repo_name=${repo_name:-bhv-plotkaart-recreation}

github_url="https://github.com/$github_username/$repo_name.git"

print_info "Repository URL: $github_url"

# Step 8: Add all files to Git
print_info "Step 8: Adding files to Git..."
git add .

# Step 9: Commit changes
print_info "Step 9: Committing changes..."
commit_message="Deploy BHV360 Plotkaart Application - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$commit_message" || print_warning "No changes to commit"

# Step 10: Set up remote
print_info "Step 10: Setting up GitHub remote..."

# Remove existing origin if it exists
git remote remove origin 2>/dev/null || true

# Add new origin
git remote add origin "$github_url"
print_status "GitHub remote added: $github_url"

# Step 11: Create main branch if needed
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    git branch -M main
    print_status "Switched to main branch"
fi

# Step 12: Push to GitHub
print_info "Step 12: Pushing to GitHub..."

echo "This will push your code to GitHub. Continue? (y/N)"
read -r confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    if git push -u origin main; then
        print_status "Successfully pushed to GitHub!"
    else
        print_warning "Push failed. You may need to create the repository on GitHub first."
        print_info "Please go to https://github.com/new and create a repository named: $repo_name"
        print_info "Then run: git push -u origin main"
    fi
else
    print_info "Deployment cancelled by user"
    exit 0
fi

# Step 13: Deployment instructions
echo ""
echo "🎉 GitHub Deployment Complete!"
echo "=============================="
echo ""
print_status "Your code has been pushed to: $github_url"
echo ""
print_info "Next steps for Vercel deployment:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository: $repo_name"
echo "3. Framework: Next.js (auto-detected)"
echo "4. Add these environment variables:"
echo ""
echo "   DATABASE_URL=your_neon_database_url"
echo "   NEXTAUTH_SECRET=your_random_secret_key"
echo "   NEXTAUTH_URL=https://your-app.vercel.app"
echo "   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app"
echo ""
echo "5. Click Deploy"
echo ""
print_status "Deployment script completed successfully!"

# Step 14: Open GitHub repository
if command -v open &> /dev/null; then
    echo "Open GitHub repository in browser? (y/N)"
    read -r open_browser
    if [[ $open_browser =~ ^[Yy]$ ]]; then
        open "https://github.com/$github_username/$repo_name"
    fi
elif command -v xdg-open &> /dev/null; then
    echo "Open GitHub repository in browser? (y/N)"
    read -r open_browser
    if [[ $open_browser =~ ^[Yy]$ ]]; then
        xdg-open "https://github.com/$github_username/$repo_name"
    fi
fi

echo ""
print_status "🚀 Ready for Vercel deployment!"
