#!/bin/bash

# Economy Simulator - Serverless Deployment Script
# This script deploys the application to Vercel (frontend) and Railway (backend)

set -e

echo "🚀 Starting serverless deployment for Economy Simulator..."

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
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    print_success "All dependencies are available"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    # Create .env files if they don't exist
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_API_URL=your_railway_backend_url_here

# Backend Environment Variables
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
JWT_SECRET=your_jwt_secret_here
EOF
        print_warning "Created .env.local file. Please update with your actual values."
    fi
    
    if [ ! -f "src/backend/.env" ]; then
        cat > src/backend/.env << EOF
# Backend Environment Variables
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
JWT_SECRET=your_jwt_secret_here
PORT=3001
EOF
        print_warning "Created src/backend/.env file. Please update with your actual values."
    fi
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    cd src/backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Build the project
    print_status "Building backend..."
    npm run build
    
    # Deploy to Railway
    print_status "Deploying to Railway..."
    railway up
    
    cd ../..
    print_success "Backend deployed to Railway"
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd src/frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build the project
    print_status "Building frontend..."
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod
    
    cd ../..
    print_success "Frontend deployed to Vercel"
}

# Setup Supabase (optional)
setup_supabase() {
    print_status "Setting up Supabase..."
    
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI not found. Installing..."
        npm install -g supabase
    fi
    
    print_warning "Please run the following commands manually to set up Supabase:"
    echo "1. supabase login"
    echo "2. supabase projects create economy-simulator"
    echo "3. Copy the project URL and keys to your .env files"
}

# Main deployment function
main() {
    print_status "Starting Economy Simulator serverless deployment..."
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_env
    
    # Ask user if they want to continue
    echo
    print_warning "Before continuing, please:"
    echo "1. Update the .env files with your actual values"
    echo "2. Set up your Supabase project"
    echo "3. Set up your Upstash Redis instance"
    echo
    read -p "Are you ready to continue with deployment? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled. Please update your environment variables and try again."
        exit 0
    fi
    
    # Deploy backend
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    # Setup instructions
    echo
    print_success "🎉 Deployment completed!"
    echo
    print_status "Next steps:"
    echo "1. Update your Vercel environment variables with the Railway backend URL"
    echo "2. Test your application"
    echo "3. Set up custom domains if needed"
    echo
    print_status "Cost breakdown:"
    echo "- Vercel (Frontend): $0/month (Free tier)"
    echo "- Railway (Backend): $5/month"
    echo "- Supabase (Database): $0/month (Free tier)"
    echo "- Upstash Redis (Cache): $0/month (Free tier)"
    echo "- Total: $5/month (99.5% savings vs enterprise)"
}

# Run main function
main "$@" 