#!/bin/bash

# BHV360 Emergency Deployment Script
# This script executes the complete deployment process immediately

# Set error handling
set -e  # Exit on any error
set -u  # Exit on undefined variables

# Script configuration
SCRIPT_START_TIME=$(date +%s)
BASE_URL="https://bhv360.vercel.app"
PROJECT_NAME="BHV360 Plotkaart Recreation"
BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Logging functions
log_header() {
    echo -e "${WHITE}$1${NC}"
    echo -e "${WHITE}$(printf '=%.0s' {1..60})${NC}"
}

log_step() {
    echo -e "\n${BLUE}🔄 $1...${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_command() {
    echo -e "${PURPLE}💻 $1${NC}"
}

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    log_error "Script failed at line $line_number with exit code $exit_code"
    log_error "Emergency deployment failed!"
    exit $exit_code
}

# Set up error trap
trap 'handle_error $LINENO' ERR

# Function to execute commands with logging
execute_command() {
    local command="$1"
    local description="$2"
    local timeout="${3:-120}"  # Default 2 minutes timeout
    
    log_step "$description"
    log_command "$command"
    
    if timeout "$timeout" bash -c "$command"; then
        log_success "$description completed"
        return 0
    else
        log_error "$description failed"
        return 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites"
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found. Are you in the project root?"
        exit 1
    fi
    
    # Check required commands
    local required_commands=("git" "node" "npm" "curl")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "$cmd is not installed or not in PATH"
            exit 1
        fi
    done
    
    # Check and install Vercel CLI if needed
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
        log_success "Vercel CLI installed"
    fi
    
    # Check git status
    if ! git status &> /dev/null; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Function to update package.json version
update_package_version() {
    log_step "Updating package.json version"
    
    # Use Node.js to update package.json
    node -e "
        const fs = require('fs');
        const path = 'package.json';
        
        if (!fs.existsSync(path)) {
            console.error('package.json not found');
            process.exit(1);
        }
        
        const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
        const currentVersion = pkg.version || '2.1.0';
        const versionParts = currentVersion.split('.');
        versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
        const newVersion = versionParts.join('.');
        
        pkg.version = newVersion;
        pkg.deployment = {
            lastDeployment: new Date().toISOString(),
            deploymentType: 'emergency-context-provider-fix',
            version: newVersion,
            fixes: [
                'CustomerProvider export and SSR safety',
                'AuthProvider export and SSR safety',
                'DataProvider export and SSR safety',
                'ThemeProvider props interface',
                'React version compatibility',
                'Health and database endpoints',
                'Prerendering error resolution'
            ]
        };
        
        // Ensure React versions are correct
        pkg.dependencies = {
            ...pkg.dependencies,
            'react': '^18.2.0',
            'react-dom': '^18.2.0'
        };
        
        pkg.devDependencies = {
            ...pkg.devDependencies,
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0'
        };
        
        fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
        console.log('Updated to version:', newVersion);
    "
    
    # Get the new version for later use
    NEW_VERSION=$(node -p "require('./package.json').version")
    log_success "Package.json updated to version $NEW_VERSION"
}

# Function to clean and install dependencies
clean_and_install() {
    log_step "Cleaning project and installing dependencies"
    
    # Remove old build artifacts and dependencies
    execute_command "rm -rf .next" "Removing .next directory"
    execute_command "rm -rf node_modules" "Removing node_modules directory"
    execute_command "rm -f package-lock.json" "Removing package-lock.json"
    
    # Install fresh dependencies
    execute_command "npm install" "Installing dependencies" 300
    
    log_success "Clean installation completed"
}

# Function to build the project
build_project() {
    log_step "Building Next.js project"
    
    # Set environment variables for build
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    
    execute_command "npm run build" "Building Next.js application" 600
    
    log_success "Build completed successfully"
}

# Function to commit and push changes
commit_and_push() {
    log_step "Committing and pushing changes to GitHub"
    
    # Add all changes
    execute_command "git add ." "Adding all changes to git"
    
    # Create commit message
    local commit_message="🚀 Emergency deployment v${NEW_VERSION} - Context Provider Fixes

✅ Fixed Issues:
- CustomerProvider export and SSR safety
- AuthProvider export and SSR safety  
- DataProvider export and SSR safety
- ThemeProvider props interface compatibility
- React version updated to 18.2.0 for compatibility
- Added comprehensive health check endpoint
- Added database test endpoint with connection verification
- Resolved all Next.js prerendering errors
- Added deployment status tracking

🔧 Technical Changes:
- Fixed useCustomer hook SSR compatibility
- Fixed useAuth hook SSR compatibility
- Fixed useData hook SSR compatibility
- Updated ThemeProvider props interface
- Added proper error boundaries
- Enhanced API route error handling

📊 Deployment Info:
- Version: ${NEW_VERSION}
- Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- Type: Emergency Context Provider Fix
- Target: Production (Vercel)

🌐 Live URLs:
- Homepage: ${BASE_URL}
- Health: ${BASE_URL}/api/health
- Database: ${BASE_URL}/api/test-database"
    
    # Commit changes
    execute_command "git commit -m \"$commit_message\"" "Committing changes"
    
    # Push to main branch
    execute_command "git push origin $BRANCH" "Pushing to GitHub"
    
    log_success "Changes pushed to GitHub successfully"
}

# Function to deploy to Vercel
deploy_to_vercel() {
    log_step "Deploying to Vercel production"
    
    # Deploy to production
    execute_command "vercel --prod --yes --confirm" "Deploying to Vercel production" 600
    
    log_success "Deployed successfully to Vercel"
}

# Function to wait for deployment
wait_for_deployment() {
    log_step "Waiting for deployment to propagate"
    
    local wait_time=20
    log_info "Waiting $wait_time seconds for deployment to be ready..."
    
    for ((i=wait_time; i>0; i--)); do
        echo -ne "\r${CYAN}⏳ Waiting... ${i}s remaining${NC}"
        sleep 1
    done
    echo ""
    
    log_success "Wait period completed"
}

# Function to test endpoints
test_endpoints() {
    log_step "Testing deployed endpoints"
    
    local endpoints=(
        "/api/health:Health Check API"
        "/api/test-database:Database Test API"
        "/api/deployment-status:Deployment Status API"
        "/:Homepage"
        "/login:Login Page"
        "/dashboard:Dashboard"
        "/bhv:BHV Module"
    )
    
    local passed_tests=0
    local total_tests=${#endpoints[@]}
    
    for endpoint_info in "${endpoints[@]}"; do
        local endpoint_path="${endpoint_info%%:*}"
        local endpoint_name="${endpoint_info##*:}"
        local full_url="${BASE_URL}${endpoint_path}"
        
        log_info "Testing $endpoint_name: $full_url"
        
        if curl -f -s -o /dev/null -w "%{http_code}" --max-time 30 "$full_url" > /dev/null 2>&1; then
            local status_code=$(curl -f -s -o /dev/null -w "%{http_code}" --max-time 30 "$full_url" 2>/dev/null)
            if [[ $status_code -ge 200 && $status_code -lt 400 ]]; then
                log_success "$endpoint_name - OK ($status_code)"
                ((passed_tests++))
            else
                log_warning "$endpoint_name - Status: $status_code"
            fi
        else
            log_warning "$endpoint_name - Failed to connect"
        fi
        
        # Small delay between tests
        sleep 1
    done
    
    # Calculate success rate
    local success_rate=$((passed_tests * 100 / total_tests))
    
    log_info "Test Results: $passed_tests/$total_tests passed ($success_rate%)"
    
    return $((total_tests - passed_tests))
}

# Function to generate deployment report
generate_report() {
    local test_failures=$1
    local script_end_time=$(date +%s)
    local duration=$((script_end_time - SCRIPT_START_TIME))
    
    log_header "DEPLOYMENT REPORT"
    
    echo -e "${WHITE}🏷️  Version: ${NEW_VERSION}${NC}"
    echo -e "${WHITE}⏱️  Duration: ${duration} seconds${NC}"
    echo -e "${WHITE}📅 Completed: $(date -u +%Y-%m-%dT%H:%M:%SZ)${NC}"
    echo -e "${WHITE}🌐 Live URL: ${BASE_URL}${NC}"
    echo ""
    echo -e "${CYAN}🔗 Important URLs:${NC}"
    echo -e "   Homepage: ${BASE_URL}"
    echo -e "   Dashboard: ${BASE_URL}/dashboard"
    echo -e "   Health Check: ${BASE_URL}/api/health"
    echo -e "   Database Test: ${BASE_URL}/api/test-database"
    echo -e "   Deployment Status: ${BASE_URL}/api/deployment-status"
    echo ""
    echo -e "${GREEN}✅ Fixed Issues:${NC}"
    echo -e "   - CustomerProvider export and SSR safety"
    echo -e "   - AuthProvider export and SSR safety"
    echo -e "   - DataProvider export and SSR safety"
    echo -e "   - ThemeProvider props interface"
    echo -e "   - React version compatibility (18.2.0)"
    echo -e "   - Health and database test endpoints"
    echo -e "   - All prerendering errors resolved"
    
    log_header ""
    
    if [[ $test_failures -eq 0 ]]; then
        log_success "ALL TESTS PASSED! DEPLOYMENT SUCCESSFUL!"
        echo -e "${GREEN}🎉 BHV360 is now live with all context provider fixes applied!${NC}"
        return 0
    elif [[ $test_failures -le 2 ]]; then
        log_warning "MOSTLY SUCCESSFUL - Some endpoints need attention"
        echo -e "${YELLOW}🔧 BHV360 is live but some features may need attention${NC}"
        return 1
    else
        log_error "MULTIPLE FAILURES - Deployment needs investigation"
        echo -e "${RED}🚨 BHV360 deployment completed but has issues${NC}"
        return 2
    fi
}

# Main execution function
main() {
    log_header "BHV360 EMERGENCY DEPLOYMENT"
    echo -e "${WHITE}📅 Start Time: $(date)${NC}"
    echo -e "${WHITE}🎯 Target URL: ${BASE_URL}${NC}"
    echo -e "${WHITE}🏗️  Project: ${PROJECT_NAME}${NC}"
    log_header ""
    
    # Execute deployment steps
    check_prerequisites
    update_package_version
    clean_and_install
    build_project
    commit_and_push
    deploy_to_vercel
    wait_for_deployment
    
    # Test the deployment
    test_endpoints
    local test_result=$?
    
    # Generate final report
    generate_report $test_result
    local report_result=$?
    
    log_header ""
    echo -e "${WHITE}📅 End Time: $(date)${NC}"
    log_header ""
    
    exit $report_result
}

# Execute main function
main "$@"
