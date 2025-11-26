#!/bin/bash

# ============================================
# FIX SCRIPT: Sync Database dengan Migrations
# ============================================
# Script ini untuk menyinkronkan database dengan migration files
# PERINGATAN: Backup database dulu sebelum menjalankan script ini!
# Jalankan di VPS production: bash scripts/fix-database-sync.sh

set -e

echo "🔧 MULAI PERBAIKAN DATABASE SYNC..."
echo "===================================="
echo ""
echo "⚠️  PERINGATAN: Pastikan sudah backup database sebelum melanjutkan!"
echo "Tekan Ctrl+C untuk membatalkan, atau Enter untuk melanjutkan..."
read

cd /var/www/alumni-site

# 1. Backup Database (jika menggunakan PostgreSQL/MySQL)
echo "💾 1. BACKING UP DATABASE..."
echo "-----------------------------"
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
if command -v pg_dump &> /dev/null; then
    DB_NAME=$(php artisan tinker --execute="echo config('database.connections.pgsql.database');" 2>/dev/null || echo "")
    if [ ! -z "$DB_NAME" ]; then
        echo "Creating PostgreSQL backup..."
        pg_dump "$DB_NAME" > "/tmp/$BACKUP_FILE" || echo "⚠️  Backup failed, but continuing..."
    fi
elif command -v mysqldump &> /dev/null; then
    echo "Creating MySQL backup..."
    mysqldump -u root --all-databases > "/tmp/$BACKUP_FILE" || echo "⚠️  Backup failed, but continuing..."
fi
echo "✅ Backup completed (if applicable)"
echo ""

# 2. Clear All Caches
echo "🧹 2. CLEARING CACHES..."
echo "------------------------"
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
echo "✅ Caches cleared"
echo ""

# 3. Check Current Migration Status
echo "📊 3. CHECKING MIGRATION STATUS..."
echo "-----------------------------------"
php artisan migrate:status
echo ""

# 4. Fix Missing Columns (Safe Operations)
echo "🔧 4. FIXING MISSING COLUMNS (SAFE OPERATIONS)..."
echo "--------------------------------------------------"

# Fix news.category if missing
php artisan tinker --execute="
    if (!\Illuminate\Support\Facades\Schema::hasColumn('news', 'category')) {
        echo 'Adding category column to news table...' . PHP_EOL;
        \Illuminate\Support\Facades\Schema::table('news', function(\$table) {
            \$table->string('category')->default('General')->after('title');
        });
        echo '✅ Added category to news' . PHP_EOL;
    } else {
        echo '✅ news.category already exists' . PHP_EOL;
    }
"

# Fix events.category if missing
php artisan tinker --execute="
    if (!\Illuminate\Support\Facades\Schema::hasColumn('events', 'category')) {
        echo 'Adding category column to events table...' . PHP_EOL;
        \Illuminate\Support\Facades\Schema::table('events', function(\$table) {
            \$table->string('category')->default('General')->after('title');
        });
        echo '✅ Added category to events' . PHP_EOL;
    } else {
        echo '✅ events.category already exists' . PHP_EOL;
    }
"

echo ""

# 5. Create Missing Tables
echo "📋 5. CREATING MISSING TABLES..."
echo "--------------------------------"

# Create activity_logs if missing
php artisan tinker --execute="
    if (!\Illuminate\Support\Facades\Schema::hasTable('activity_logs')) {
        echo 'Creating activity_logs table...' . PHP_EOL;
        \Illuminate\Support\Facades\Schema::create('activity_logs', function(\$table) {
            \$table->id();
            \$table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            \$table->string('action');
            \$table->text('description')->nullable();
            \$table->string('ip_address')->nullable();
            \$table->text('user_agent')->nullable();
            \$table->json('properties')->nullable();
            \$table->timestamps();
        });
        echo '✅ Created activity_logs table' . PHP_EOL;
    } else {
        echo '✅ activity_logs table already exists' . PHP_EOL;
    }
"

# Create alumni_skill pivot if missing
php artisan tinker --execute="
    if (!\Illuminate\Support\Facades\Schema::hasTable('alumni_skill')) {
        echo 'Creating alumni_skill pivot table...' . PHP_EOL;
        \Illuminate\Support\Facades\Schema::create('alumni_skill', function(\$table) {
            \$table->id();
            \$table->foreignId('alumni_id')->constrained('alumnis')->onDelete('cascade');
            \$table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
        });
        echo '✅ Created alumni_skill table' . PHP_EOL;
    } else {
        echo '✅ alumni_skill table already exists' . PHP_EOL;
    }
"

echo ""

# 6. Run Migrations (Force - untuk production)
echo "🚀 6. RUNNING MIGRATIONS..."
echo "----------------------------"
echo "Running: php artisan migrate --force"
php artisan migrate --force
echo "✅ Migrations completed"
echo ""

# 7. Rebuild Cache
echo "💾 7. REBUILDING CACHES..."
echo "--------------------------"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "✅ Caches rebuilt"
echo ""

# 8. Verify Schema
echo "✅ 8. VERIFYING SCHEMA..."
echo "-------------------------"
echo "Checking critical tables..."

php artisan tinker --execute="
    \$tables = ['news', 'events', 'activity_logs', 'alumni_skill'];
    foreach (\$tables as \$table) {
        if (\Illuminate\Support\Facades\Schema::hasTable(\$table)) {
            echo '✅ Table ' . \$table . ' exists' . PHP_EOL;
        } else {
            echo '❌ Table ' . \$table . ' MISSING' . PHP_EOL;
        }
    }
    
    if (\Illuminate\Support\Facades\Schema::hasColumn('news', 'category')) {
        echo '✅ news.category exists' . PHP_EOL;
    } else {
        echo '❌ news.category MISSING' . PHP_EOL;
    }
    
    if (\Illuminate\Support\Facades\Schema::hasColumn('events', 'category')) {
        echo '✅ events.category exists' . PHP_EOL;
    } else {
        echo '❌ events.category MISSING' . PHP_EOL;
    }
"

echo ""
echo "✅ PERBAIKAN SELESAI!"
echo "===================================="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Test akses admin/news dan admin/events"
echo "2. Cek Laravel logs jika masih ada error"
echo "3. Jika masih error, jalankan: bash scripts/diagnose-deployment.sh"

