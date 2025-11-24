#!/bin/bash

# Production Deployment Script for Alumni Site
# Usage: ./deploy.sh

set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo -e "${RED}Error: artisan file not found. Please run this script from the Laravel root directory.${NC}"
    exit 1
fi

# Step 1: Install/Update Dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
composer install --optimize-autoloader --no-dev --no-interaction

# Step 2: Build Frontend Assets
echo -e "${YELLOW}🎨 Building frontend assets...${NC}"
npm ci
npm run build

# Step 3: Clear All Caches
echo -e "${YELLOW}🧹 Clearing caches...${NC}"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Step 4: Run Migrations (if needed)
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗄️  Running migrations...${NC}"
    php artisan migrate --force
fi

# Step 5: Cache Configuration for Production
echo -e "${YELLOW}⚡ Optimizing for production...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 6: Link Storage
if [ ! -L "public/storage" ]; then
    echo -e "${YELLOW}🔗 Linking storage...${NC}"
    php artisan storage:link
fi

# Step 7: Set Permissions
echo -e "${YELLOW}🔒 Setting permissions...${NC}"
chmod -R 755 storage bootstrap/cache
chmod -R 755 storage/logs

# Step 8: Check .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}Warning: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file from .env.example${NC}"
    exit 1
fi

# Step 9: Check APP_KEY
if ! grep -q "APP_KEY=base64:" .env; then
    echo -e "${YELLOW}🔑 Generating application key...${NC}"
    php artisan key:generate
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🎉 Your application is ready for production!${NC}"

