# ⚡ Quick Fix Guide - Deployment Issues

## 🎯 TL;DR - Langkah Cepat

### 1. Diagnosa Masalah (5 menit)
```bash
# Di VPS production
cd /var/www/alumni-site
bash scripts/diagnose-deployment.sh
```

### 2. Fix Database Sync (10 menit)
```bash
# Backup dulu! (via Neon dashboard atau pg_dump)
cd /var/www/alumni-site
bash scripts/fix-database-sync.sh
```

### 3. Test Routes
- Akses: `https://yourdomain.com/admin/news`
- Akses: `https://yourdomain.com/admin/events`
- Harus tidak ada error 500

### 4. Clear Cache (jika masih error)
```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
```

---

## 🔴 Error 500 di /admin/news atau /admin/events?

**Kemungkinan besar:** Missing kolom `category` atau missing tabel `activity_logs`

**Fix cepat:**
```bash
php artisan tinker
```

```php
// Cek dan fix category column
if (!Schema::hasColumn('news', 'category')) {
    Schema::table('news', function($table) {
        $table->string('category')->default('General')->after('title');
    });
}

if (!Schema::hasColumn('events', 'category')) {
    Schema::table('events', function($table) {
        $table->string('category')->default('General')->after('title');
    });
}

// Cek dan fix activity_logs table
if (!Schema::hasTable('activity_logs')) {
    Schema::create('activity_logs', function($table) {
        $table->id();
        $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        $table->string('action');
        $table->text('description')->nullable();
        $table->string('ip_address')->nullable();
        $table->text('user_agent')->nullable();
        $table->json('properties')->nullable();
        $table->timestamps();
    });
}
```

---

## 🔴 GitHub Actions Selalu Fail?

**Kemungkinan besar:** Migration gagal atau npm build gagal

**Fix:**
- Workflow sudah diperbaiki dengan better error handling
- Push commit baru untuk trigger workflow baru
- Cek GitHub Actions logs untuk error message yang jelas

---

## 📋 Checklist Cepat

- [ ] Backup database
- [ ] Jalankan `diagnose-deployment.sh`
- [ ] Jalankan `fix-database-sync.sh`
- [ ] Test `/admin/news` dan `/admin/events`
- [ ] Clear cache
- [ ] Test lagi

---

## 🆘 Masih Error?

1. Enable debug mode sementara: `APP_DEBUG=true` di `.env`
2. Cek logs: `tail -f storage/logs/laravel.log`
3. Akses route yang error, lihat error message
4. Fix sesuai error message
5. Disable debug mode: `APP_DEBUG=false`

Lihat `DEBUGGING_GUIDE.md` untuk panduan lengkap.

