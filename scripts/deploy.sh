#!/bin/bash

# Frontend deployment script for cloud platforms
# This script prepares the frontend for deployment

set -e

echo "🚀 Preparing frontend for cloud deployment..."

# Check if REACT_APP_API_URL is set
if [ -z "$REACT_APP_API_URL" ]; then
    echo "❌ Error: REACT_APP_API_URL environment variable is not set"
    echo "Please set it to your backend URL (e.g., https://your-backend.onrender.com)"
    exit 1
fi

echo "📡 API URL: $REACT_APP_API_URL"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Build for production
echo "🏗️  Building for production..."
npm run build:production

# Verify build
if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

echo "✅ Frontend build completed successfully!"
echo "📁 Build directory: $(pwd)/build"
echo "🌐 Ready for deployment to cloud platform"

# Show build size
echo "📊 Build size:"
du -sh build/

echo ""
echo "🎉 Frontend is ready for deployment!"
echo "💡 Next steps:"
echo "   1. Upload the 'build' directory to your cloud platform"
echo "   2. Configure your cloud platform to serve static files from 'build'"
echo "   3. Set up environment variables in your cloud platform"
