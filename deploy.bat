@echo off
REM Production Deployment Script for Alumni Site (Windows)
REM Usage: deploy.bat

echo 🚀 Starting production deployment...

REM Check if we're in the right directory
if not exist "artisan" (
    echo Error: artisan file not found. Please run this script from the Laravel root directory.
    exit /b 1
)

REM Step 1: Install/Update Dependencies
echo 📦 Installing dependencies...
call composer install --optimize-autoloader --no-dev --no-interaction
if errorlevel 1 (
    echo Error: Composer install failed!
    exit /b 1
)

REM Step 2: Build Frontend Assets
echo 🎨 Building frontend assets...
call npm ci
if errorlevel 1 (
    echo Error: npm ci failed!
    exit /b 1
)
call npm run build
if errorlevel 1 (
    echo Error: npm build failed!
    exit /b 1
)

REM Step 3: Clear All Caches
echo 🧹 Clearing caches...
call php artisan config:clear
call php artisan cache:clear
call php artisan route:clear
call php artisan view:clear

REM Step 4: Run Migrations
set /p RUN_MIGRATIONS="Do you want to run database migrations? (y/n): "
if /i "%RUN_MIGRATIONS%"=="y" (
    echo 🗄️  Running migrations...
    call php artisan migrate --force
)

REM Step 5: Cache Configuration for Production
echo ⚡ Optimizing for production...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache

REM Step 6: Link Storage
if not exist "public\storage" (
    echo 🔗 Linking storage...
    call php artisan storage:link
)

REM Step 7: Check .env file
if not exist ".env" (
    echo Warning: .env file not found!
    echo Please create .env file from .env.example
    exit /b 1
)

REM Step 8: Check APP_KEY
findstr /C:"APP_KEY=base64:" .env >nul
if errorlevel 1 (
    echo 🔑 Generating application key...
    call php artisan key:generate
)

echo ✅ Deployment completed successfully!
echo 🎉 Your application is ready for production!
pause




