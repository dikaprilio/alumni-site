#!/bin/bash

# ============================================
# DIAGNOSTIC SCRIPT: Deployment Issues
# ============================================
# Script ini untuk mendiagnosis masalah deployment
# Jalankan di VPS production: bash scripts/diagnose-deployment.sh

set -e

echo "🔍 MULAI DIAGNOSIS DEPLOYMENT ISSUES..."
echo "=========================================="
echo ""

# 1. Cek Status Git
echo "📦 1. CHECKING GIT STATUS..."
echo "----------------------------"
cd /var/www/alumni-site
echo "Current branch: $(git branch --show-current)"
echo "Last commit: $(git log -1 --oneline)"
echo "Git status:"
git status --short
echo ""

# 2. Cek Migration Status
echo "🗄️  2. CHECKING MIGRATION STATUS..."
echo "-----------------------------------"
php artisan migrate:status
echo ""

# 3. Cek Database Schema vs Code
echo "🔍 3. CHECKING DATABASE SCHEMA..."
echo "----------------------------------"
echo "Checking critical tables..."

# Check news table
echo ""
echo "📰 NEWS TABLE:"
php artisan tinker --execute="
    \$columns = \Illuminate\Support\Facades\Schema::getColumnListing('news');
    echo 'Columns: ' . implode(', ', \$columns) . PHP_EOL;
    echo 'Has category: ' . (in_array('category', \$columns) ? 'YES' : 'NO') . PHP_EOL;
    echo 'Has user_id: ' . (in_array('user_id', \$columns) ? 'YES' : 'NO') . PHP_EOL;
"

# Check events table
echo ""
echo "📅 EVENTS TABLE:"
php artisan tinker --execute="
    \$columns = \Illuminate\Support\Facades\Schema::getColumnListing('events');
    echo 'Columns: ' . implode(', ', \$columns) . PHP_EOL;
    echo 'Has category: ' . (in_array('category', \$columns) ? 'YES' : 'NO') . PHP_EOL;
    echo 'Has user_id: ' . (in_array('user_id', \$columns) ? 'YES' : 'NO') . PHP_EOL;
"

# Check activity_logs table
echo ""
echo "📋 ACTIVITY_LOGS TABLE:"
php artisan tinker --execute="
    if (\Illuminate\Support\Facades\Schema::hasTable('activity_logs')) {
        \$columns = \Illuminate\Support\Facades\Schema::getColumnListing('activity_logs');
        echo 'Table exists: YES' . PHP_EOL;
        echo 'Columns: ' . implode(', ', \$columns) . PHP_EOL;
    } else {
        echo 'Table exists: NO' . PHP_EOL;
    }
"

# Check alumni_skill pivot table
echo ""
echo "🔗 ALUMNI_SKILL PIVOT TABLE:"
php artisan tinker --execute="
    if (\Illuminate\Support\Facades\Schema::hasTable('alumni_skill')) {
        \$columns = \Illuminate\Support\Facades\Schema::getColumnListing('alumni_skill');
        echo 'Table exists: YES' . PHP_EOL;
        echo 'Columns: ' . implode(', ', \$columns) . PHP_EOL;
    } else {
        echo 'Table exists: NO' . PHP_EOL;
    }
"

echo ""
echo ""

# 4. Cek Laravel Logs untuk Error 500
echo "📝 4. CHECKING RECENT ERRORS IN LARAVEL LOG..."
echo "-----------------------------------------------"
if [ -f storage/logs/laravel.log ]; then
    echo "Last 50 lines with errors:"
    tail -n 50 storage/logs/laravel.log | grep -i "error\|exception\|fatal" | tail -n 20 || echo "No recent errors found"
else
    echo "Log file not found"
fi
echo ""

# 5. Cek Foreign Keys
echo "🔗 5. CHECKING FOREIGN KEY CONSTRAINTS..."
echo "------------------------------------------"
php artisan tinker --execute="
    \$connection = \Illuminate\Support\Facades\DB::connection();
    \$database = \$connection->getDatabaseName();
    
    \$foreignKeys = \Illuminate\Support\Facades\DB::select(\"
        SELECT 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = '\$database'
        ORDER BY tc.table_name, kcu.column_name
    \");
    
    foreach (\$foreignKeys as \$fk) {
        echo \$fk->table_name . '.' . \$fk->column_name . ' -> ' . \$fk->foreign_table_name . '.' . \$fk->foreign_column_name . PHP_EOL;
    }
"

echo ""
echo ""

# 6. Test Route Accessibility
echo "🌐 6. TESTING ROUTE ACCESSIBILITY..."
echo "-------------------------------------"
echo "Testing admin routes (this will show if routes are registered):"
php artisan route:list | grep -E "admin/news|admin/event" || echo "Routes not found in route list"
echo ""

# 7. Cek Cache Status
echo "💾 7. CHECKING CACHE STATUS..."
echo "-------------------------------"
echo "Config cached: $([ -f bootstrap/cache/config.php ] && echo 'YES' || echo 'NO')"
echo "Route cached: $([ -f bootstrap/cache/routes-v7.php ] && echo 'YES' || echo 'NO')"
echo "View cached: $([ -d storage/framework/views ] && echo 'YES' || echo 'NO')"
echo ""

# 8. Cek Environment
echo "⚙️  8. CHECKING ENVIRONMENT..."
echo "-------------------------------"
echo "APP_ENV: $(php artisan tinker --execute="echo config('app.env');")"
echo "APP_DEBUG: $(php artisan tinker --execute="echo config('app.debug') ? 'true' : 'false';")"
echo "DB_CONNECTION: $(php artisan tinker --execute="echo config('database.default');")"
echo ""

echo "✅ DIAGNOSIS SELESAI!"
echo "=========================================="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Review output di atas untuk identifikasi masalah"
echo "2. Jika ada schema mismatch, jalankan: bash scripts/fix-database-sync.sh"
echo "3. Jika ada error di logs, periksa detail error tersebut"
echo "4. Clear cache jika diperlukan: php artisan optimize:clear"

