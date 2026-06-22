#!/bin/bash
# Bash Deployment Script for Persona Sintetis
# Usage: ./scripts/deploy.sh

set -e

echo "========================================"
echo "  Persona Sintetis - Deployment Script"
echo "========================================"
echo ""

# Step 1: Install dependencies
echo "[1/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    exit 1
fi

# Step 2: Build Angular application
echo ""
echo "[2/5] Building Angular application..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi

# Step 3: Verify build output
echo ""
echo "[3/5] Verifying build output..."
BUILD_PATH="dist/persona-sintetis/browser"
if [ ! -d "$BUILD_PATH" ]; then
    echo "ERROR: Build directory not found at $BUILD_PATH"
    exit 1
fi

if [ ! -f "$BUILD_PATH/index.html" ]; then
    echo "ERROR: index.html not found in build directory"
    exit 1
fi

echo "✓ Build verified successfully"

# Step 4: Check Express dependencies
echo ""
echo "[4/5] Checking Express server dependencies..."
if [ ! -d "node_modules/express" ]; then
    echo "Installing Express..."
    npm install express
    if [ $? -ne 0 ]; then
        echo "ERROR: Express installation failed"
        exit 1
    fi
else
    echo "✓ Express already installed"
fi

# Step 5: Complete
echo ""
echo "[5/5] Deployment complete!"
echo ""
echo "To start the server, run:"
echo "  npm run serve"
echo ""
echo "To start Cloudflare Tunnel, run:"
echo "  cloudflared tunnel run persona-sintetis-tunnel"
echo ""
