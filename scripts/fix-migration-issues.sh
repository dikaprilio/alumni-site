#!/bin/bash

# ============================================
# FIX SCRIPT: Migration Issues
# ============================================
# Script ini untuk fix migration yang gagal
# Jalankan di VPS: bash scripts/fix-migration-issues.sh

set -e

echo "🔧 MULAI PERBAIKAN MIGRATION ISSUES..."
echo "======================================"
echo ""

cd /var/www/alumni-site

# 1. Rollback failed transaction
echo "🔄 1. ROLLING BACK FAILED TRANSACTION..."
echo "----------------------------------------"
php artisan tinker --execute="
    try {
        \Illuminate\Support\Facades\DB::rollBack();
        echo '✅ Transaction rolled back' . PHP_EOL;
    } catch (Exception \$e) {
        echo '⚠️  No active transaction to rollback' . PHP_EOL;
    }
"
echo ""

# 2. Mark pending migrations as ran (skip migrations yang tidak ada di repo)
echo "📝 2. MARKING MISSING MIGRATIONS AS RAN..."
echo "-------------------------------------------"
php artisan tinker --execute="
    \$missingMigrations = [
        '2025_11_25_030015_fix_alumni_skill_composite_key',
        '2025_11_25_030043_add_unique_constraint_to_alumnis_user_id'
    ];
    
    foreach (\$missingMigrations as \$migration) {
        if (!\Illuminate\Support\Facades\DB::table('migrations')->where('migration', \$migration)->exists()) {
            \Illuminate\Support\Facades\DB::table('migrations')->insert([
                'migration' => \$migration,
                'batch' => \Illuminate\Support\Facades\DB::table('migrations')->max('batch') + 1
            ]);
            echo '✅ Marked ' . \$migration . ' as ran' . PHP_EOL;
        } else {
            echo 'ℹ️  ' . \$migration . ' already marked as ran' . PHP_EOL;
        }
    }
"
echo ""

# 3. Clear route cache (untuk fix route list issue)
echo "🧹 3. CLEARING ROUTE CACHE..."
echo "-----------------------------"
php artisan route:clear
echo "✅ Route cache cleared"
echo ""

# 4. Rebuild route cache
echo "💾 4. REBUILDING ROUTE CACHE..."
echo "--------------------------------"
php artisan route:cache
echo "✅ Route cache rebuilt"
echo ""

# 5. Verify routes
echo "🌐 5. VERIFYING ROUTES..."
echo "-------------------------"
php artisan route:list | grep -E "admin/news|admin/event" | head -5 || echo "⚠️  Routes not found (might need to check route definitions)"
echo ""

# 6. Disable APP_DEBUG (Security)
echo "🔒 6. DISABLING APP_DEBUG..."
echo "----------------------------"
if grep -q "APP_DEBUG=true" .env; then
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
    echo "✅ APP_DEBUG disabled"
    php artisan config:clear
    php artisan config:cache
else
    echo "ℹ️  APP_DEBUG already disabled or not found"
fi
echo ""

# 7. Final verification
echo "✅ 7. FINAL VERIFICATION..."
echo "---------------------------"
echo "Migration status:"
php artisan migrate:status | tail -5
echo ""

echo "✅ PERBAIKAN SELESAI!"
echo "======================================"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Test akses /admin/news dan /admin/events"
echo "2. Cek Laravel logs jika masih ada error"
echo "3. Monitor GitHub Actions untuk workflow berikutnya"

