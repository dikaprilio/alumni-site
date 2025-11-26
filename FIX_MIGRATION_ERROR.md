# 🔧 Fix Migration Error - Quick Guide

## 🎯 Masalah yang Ditemukan

Dari hasil diagnostik:

1. ✅ **Schema sudah OK**: news.category, events.category, activity_logs, alumni_skill semua ada
2. ❌ **Migration gagal**: `2025_11_25_030015_fix_alumni_skill_composite_key` gagal dengan transaction error
3. ⚠️ **Migration pending**: 2 migration pending yang tidak ada di repo local
4. ⚠️ **Route cache issue**: Routes tidak muncul di route list
5. ⚠️ **APP_DEBUG: true**: Masih dalam debug mode (security risk)

---

## ✅ Solusi Cepat

### Step 1: Fix Migration Issues

```bash
# Di VPS
cd /var/www/alumni-site
bash scripts/fix-migration-issues.sh
```

Script ini akan:
- Rollback failed transaction
- Mark missing migrations as ran (skip)
- Clear dan rebuild route cache
- Disable APP_DEBUG

---

### Step 2: Manual Fix (Jika Script Gagal)

#### 2.1. Rollback Transaction & Skip Migrations

```bash
php artisan tinker
```

```php
// Rollback transaction yang failed
DB::rollBack();

// Mark missing migrations as ran (skip)
$missingMigrations = [
    '2025_11_25_030015_fix_alumni_skill_composite_key',
    '2025_11_25_030043_add_unique_constraint_to_alumnis_user_id'
];

foreach ($missingMigrations as $migration) {
    if (!DB::table('migrations')->where('migration', $migration)->exists()) {
        DB::table('migrations')->insert([
            'migration' => $migration,
            'batch' => DB::table('migrations')->max('batch') + 1
        ]);
        echo "Marked $migration as ran\n";
    }
}

exit
```

#### 2.2. Clear Route Cache

```bash
php artisan route:clear
php artisan route:cache
```

#### 2.3. Disable APP_DEBUG

```bash
# Edit .env
nano .env

# Cari APP_DEBUG=true, ubah jadi:
APP_DEBUG=false

# Clear dan rebuild config cache
php artisan config:clear
php artisan config:cache
```

---

## 🔍 Penjelasan Masalah

### 1. Migration File Tidak Ada di Repo

Migration `2025_11_25_030015_fix_alumni_skill_composite_key` dan `2025_11_25_030043_add_unique_constraint_to_alumnis_user_id` tidak ada di repo local. Ini berarti:
- Migration dibuat langsung di production (via tinker/manual)
- Atau ada di commit yang belum di-pull
- Atau migration ini tidak diperlukan

**Solusi**: Mark sebagai "ran" di database (skip) karena tidak ada di repo.

### 2. Transaction Error

Error `current transaction is aborted` terjadi karena:
- Migration sebelumnya gagal
- Transaction tidak di-rollback
- Semua command berikutnya diabaikan

**Solusi**: Rollback transaction, lalu skip migration yang bermasalah.

### 3. Route Cache Issue

Routes tidak muncul karena:
- Route cache corrupt atau tidak ter-update
- Route definitions berubah tapi cache belum di-clear

**Solusi**: Clear dan rebuild route cache.

### 4. APP_DEBUG: true

Masih dalam debug mode di production (security risk).

**Solusi**: Disable di `.env` dan rebuild config cache.

---

## 📋 Checklist Setelah Fix

- [ ] Migration status tidak ada yang pending (kecuali yang di-skip)
- [ ] Route list menunjukkan admin routes
- [ ] APP_DEBUG=false di .env
- [ ] Config cache sudah di-rebuild
- [ ] Route cache sudah di-rebuild
- [ ] Test akses `/admin/news` - harus tidak error 500
- [ ] Test akses `/admin/events` - harus tidak error 500

---

## 🚨 Jika Masih Ada Error 500

1. **Enable debug mode sementara:**
   ```bash
   # Di .env
   APP_DEBUG=true
   php artisan config:clear
   php artisan config:cache
   ```

2. **Cek Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Akses route yang error**, lihat error message di browser atau log

4. **Fix sesuai error message**

5. **Disable debug mode kembali:**
   ```bash
   APP_DEBUG=false
   php artisan config:clear
   php artisan config:cache
   ```

---

## 💡 Prevention

1. **Jangan buat migration langsung di production**
   - Selalu buat migration file di local
   - Commit dan push ke repo
   - Pull di production, lalu jalankan migrate

2. **Test migration di local/staging dulu**
   ```bash
   php artisan migrate:fresh --seed
   ```

3. **Monitor migration status**
   ```bash
   php artisan migrate:status
   ```

4. **Selalu disable APP_DEBUG di production**
   - Set `APP_DEBUG=false` di `.env` production
   - Jangan commit `.env` dengan `APP_DEBUG=true`

---

## 📞 Next Steps

Setelah fix migration issues:

1. ✅ Test routes `/admin/news` dan `/admin/events`
2. ✅ Monitor Laravel logs untuk error baru
3. ✅ Test GitHub Actions workflow (push commit baru)
4. ✅ Pastikan APP_DEBUG=false di production

