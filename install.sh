#!/bin/bash

# Active Orders of Protection System - Installation Script
# This script installs all dependencies and sets up the application

set -e  # Exit on error

echo "=================================="
echo "Active Orders of Protection System"
echo "Installation Script"
echo "=================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed."
    echo ""
    echo "Please install Node.js (v18 or higher) from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js found: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    echo ""
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm found: v$NPM_VERSION"

echo ""
echo "Installing dependencies..."
echo "This may take a few minutes..."
echo ""

# Install dependencies
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""
echo "=================================="
print_success "Installation completed successfully!"
echo "=================================="
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To build for production, run:"
echo "  npm run build"
echo ""
echo "To preview the production build, run:"
echo "  npm run preview"
echo ""
echo "Default development server will run at:"
echo "  http://localhost:8080"
echo ""
print_info "Note: On first run, you'll see a splash screen with a disclaimer."
print_info "Use the Admin Panel (gear icon) to configure the system and add records."
echo ""
