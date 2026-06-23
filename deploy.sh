#!/bin/bash
# Quick Deploy Script - Character Consistency Feature
# Run this to deploy everything in one go

set -e

echo "🚀 Character Consistency Feature - Deployment"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

# Check Wrangler
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi
echo -e "${GREEN}✅ Wrangler: $(wrangler --version)${NC}"

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found${NC}"
    echo "Install with: npm install -g supabase"
fi
echo -e "${GREEN}✅ Supabase CLI: $(supabase --version)${NC}"

echo ""
echo "📦 Step 1: Install Worker Dependencies"
echo "--------------------------------------"
cd workers/character-consistency
npm install
echo -e "${GREEN}✅ Worker dependencies installed${NC}"

echo ""
echo "🔐 Step 2: Configure Secrets (First Time Only)"
echo "-----------------------------------------------"
echo "You need to set these secrets (skip if already set):"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_ANON_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo "  - CLOUDFLARE_AI_API_TOKEN"
echo ""
read -p "Set secrets now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wrangler login
    wrangler secret put SUPABASE_URL
    wrangler secret put SUPABASE_ANON_KEY
    wrangler secret put SUPABASE_SERVICE_ROLE_KEY
    wrangler secret put CLOUDFLARE_AI_API_TOKEN
    echo -e "${GREEN}✅ Secrets configured${NC}"
fi

echo ""
echo "🔨 Step 3: Deploy Worker"
echo "------------------------"
echo "Deploying to Cloudflare Workers..."
npm run deploy
echo -e "${GREEN}✅ Worker deployed${NC}"

echo ""
echo "📊 Step 4: Apply Supabase Migrations"
echo "-------------------------------------"
cd ../../
echo "Applying database migrations..."

# Check if Supabase is linked
if [ ! -d "supabase" ]; then
    echo -e "${RED}❌ Supabase directory not found${NC}"
    exit 1
fi

# Try to apply migrations
if command -v supabase &> /dev/null; then
    read -p "Apply migrations to linked Supabase project? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        supabase db push
        echo -e "${GREEN}✅ Migrations applied${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Supabase CLI not installed. Apply migrations manually:${NC}"
    echo "1. Go to Supabase Dashboard"
    echo "2. Open SQL Editor"
    echo "3. Copy and run files from supabase/migrations/"
fi

echo ""
echo "🎨 Step 5: Build Frontend"
echo "-------------------------"
echo "Installing frontend dependencies..."
npm install

echo "Building for production..."
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "Next steps:"
echo "1. Update src/environments/environment.prod.ts with your API URLs"
echo "2. Deploy frontend to your hosting (Cloudflare Pages, Vercel, etc.)"
echo "3. Test the feature end-to-end"
echo ""
echo "Worker URL: https://character-consistency-api.<your-subdomain>.workers.dev"
echo "Frontend: http://localhost:4200 (dev) or your production URL"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
