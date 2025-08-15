#!/bin/bash

echo "🚀 Deploying BHV360 to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify (if not already logged in)
echo "Checking Netlify authentication..."
netlify status || netlify login

# Build the application
echo "Building application..."
npm run build

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=.next

echo "✅ Deployment completed!"
echo "Your app should be available at your Netlify URL"
