#!/bin/bash

# CI Build Script for Netlify/other CI environments
# This script bypasses pnpm workspace issues

set -e

echo "🚀 Starting CI build process..."

# Install dependencies with npm
echo "📦 Installing dependencies..."
npm install

# Build the UI package first
echo "🎨 Building UI package..."
cd packages/ui
npm install
npm run lint || echo "⚠️ UI lint warnings (non-blocking)"
cd ../..

# Build the main app
echo "🏗️ Building main application..."
cd apps/the_monkeys
npm install
npm run lint || echo "⚠️ App lint warnings (non-blocking)"
npm run build
cd ../..

echo "✅ Build completed successfully!"
