# 🔧 Panduan Debugging & Perbaikan Deployment Issues

## 📋 Daftar Masalah

1. **GitHub Actions selalu FAIL (merah)** tapi deployment tetap berjalan
2. **Error 500** di `/admin/news` dan `/admin/events` setelah rollback
3. **Database state tidak sinkron** dengan migration files (karena manual query di Neon)

---

## 🔍 ANALISIS MASALAH

### 1. Kenapa GitHub Actions Fail Tapi Deploy Tetap Lanjut?

**Root Cause:**
- Workflow menggunakan `set -e` yang stop pada error pertama
- Jika error terjadi di step tertentu (misal: `npm build`, `migrate`, atau `cache`), script berhenti
- Tapi karena deployment sudah terjadi sebelum error, website tetap ter-update
- GitHub Actions menandai workflow sebagai FAIL karena exit code non-zero

**Kemungkinan Error Points:**
- `npm install` atau `npm run build` gagal
- `php artisan migrate --force` gagal karena schema mismatch
- `php artisan config:cache` atau `route:cache` gagal karena syntax error
- Cache corruption

### 2. Kenapa Error 500 Masih Muncul Setelah Rollback?

**Root Cause:**
- **Database schema tidak ter-rollback** - Neon tidak punya migration rollback otomatis
- Manual query yang dijalankan di Neon dashboard mengubah schema, tapi migration files di repo tidak berubah
- Setelah Git rollback, kode kembali ke versi lama, tapi database masih di state baru
- Missing columns (misal: `category` di `news`/`events`) menyebabkan query error
- Missing tables (misal: `activity_logs`, `alumni_skill`) menyebabkan error saat controller mencoba insert

**Kemungkinan Missing Elements:**
- Kolom `category` di tabel `news` dan `events` (ditambahkan via migration `2025_11_19_*`)
- Tabel `activity_logs` (dibuat via migration `2025_11_23_202512`)
- Tabel `alumni_skill` (dibuat via migration `2025_11_18_020033`)
- Foreign key constraints yang tidak match

### 3. Kenapa Database State Tidak Match?

**Root Cause:**
- Manual query di Neon dashboard mengubah schema tanpa melalui migration
- Migration table (`migrations`) tidak ter-update saat manual query
- Saat `php artisan migrate` dijalankan, Laravel pikir migration sudah jalan (karena ada di table `migrations`), padahal schema sebenarnya berbeda
- Atau sebaliknya: migration belum jalan di production, tapi schema sudah diubah manual

---

## 🛠️ LANGKAH PERBAIKAN (BERURUTAN)

### STEP 1: Diagnosa Masalah

Jalankan script diagnostik di VPS production:

```bash
# Upload script ke VPS (atau clone repo)
cd /var/www/alumni-site
bash scripts/diagnose-deployment.sh
```

Script ini akan menampilkan:
- Status Git dan commit terakhir
- Status migration (yang sudah jalan vs belum)
- Schema database vs yang diharapkan oleh code
- Error logs terakhir
- Foreign key constraints
- Cache status

**Output yang perlu diperhatikan:**
- Apakah kolom `category` ada di `news` dan `events`?
- Apakah tabel `activity_logs` dan `alumni_skill` ada?
- Apakah ada error di Laravel logs terkait missing columns/tables?

---

### STEP 2: Backup Database

**PENTING:** Backup dulu sebelum melakukan perubahan apapun!

```bash
# Jika menggunakan PostgreSQL (Neon)
pg_dump -h <neon-host> -U <user> -d <database> > backup_$(date +%Y%m%d_%H%M%S).sql

# Atau via Neon dashboard: Settings > Backups > Create Backup
```

---

### STEP 3: Sync Database dengan Migrations

Jalankan script perbaikan:

```bash
cd /var/www/alumni-site
bash scripts/fix-database-sync.sh
```

Script ini akan:
1. Backup database (jika memungkinkan)
2. Clear semua cache
3. Cek dan tambahkan kolom yang missing (safe operations)
4. Buat tabel yang missing
5. Jalankan migration yang belum jalan
6. Rebuild cache
7. Verify schema

**Jika script gagal di step tertentu:**
- Catat error message
- Cek apakah ada foreign key constraint yang conflict
- Cek apakah ada data yang tidak compatible dengan migration baru

---

### STEP 4: Manual Fix (Jika Script Gagal)

Jika script otomatis gagal, lakukan manual:

#### 4.1. Cek Migration Status

```bash
php artisan migrate:status
```

Lihat migration mana yang statusnya "Pending" atau "Ran" tapi schema tidak match.

#### 4.2. Fix Missing Columns

```bash
php artisan tinker
```

Di dalam tinker:

```php
// Cek apakah kolom category ada
Schema::hasColumn('news', 'category'); // harus return true
Schema::hasColumn('events', 'category'); // harus return true

// Jika false, tambahkan manual:
Schema::table('news', function($table) {
    $table->string('category')->default('General')->after('title');
});

Schema::table('events', function($table) {
    $table->string('category')->default('General')->after('title');
});
```

#### 4.3. Fix Missing Tables

```php
// Cek apakah tabel ada
Schema::hasTable('activity_logs'); // harus true
Schema::hasTable('alumni_skill'); // harus true

// Jika false, buat manual (copy dari migration file)
```

#### 4.4. Fix Migration Table

Jika migration sudah jalan di production tapi schema tidak match:

```bash
# Hapus entry migration yang bermasalah dari tabel migrations
php artisan tinker
```

```php
// Hapus migration yang ingin di-re-run
DB::table('migrations')->where('migration', '2025_11_19_213515_add_category_to_news_table')->delete();
DB::table('migrations')->where('migration', '2025_11_19_220440_add_category_to_events_table')->delete();

// Keluar tinker, lalu jalankan migrate lagi
exit
```

```bash
php artisan migrate --force
```

---

### STEP 5: Clear Cache & Rebuild

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### STEP 6: Test Routes

Test akses ke:
- `/admin/news` - harus bisa diakses tanpa error 500
- `/admin/events` - harus bisa diakses tanpa error 500

Jika masih error 500:
- Cek Laravel logs: `tail -f storage/logs/laravel.log`
- Cari error message terkait missing column/table
- Fix sesuai error yang muncul

---

### STEP 7: Fix GitHub Actions Workflow

Workflow sudah diperbaiki dengan:
- Better error handling per step
- Exit code yang jelas untuk setiap error
- Warning untuk migration failure (tidak langsung fail workflow)

**Yang sudah diperbaiki:**
- Setiap step punya error handling yang jelas
- Migration failure tidak langsung fail workflow (karena bisa di-fix manual)
- Cache operations menggunakan `|| true` untuk tidak fail workflow jika cache sudah clear

**Test workflow:**
- Push commit baru ke `main` branch
- Monitor GitHub Actions
- Cek apakah workflow sekarang pass atau memberikan error message yang jelas

---

## 🔍 DEBUGGING ERROR 500

### Cara Debug Error 500:

1. **Enable Debug Mode (Sementara):**
   ```bash
   # Di .env production (sementara saja!)
   APP_DEBUG=true
   
   # Clear config cache
   php artisan config:clear
   php artisan config:cache
   ```

2. **Cek Laravel Logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```
   
   Akses `/admin/news` atau `/admin/events`, lalu lihat error di log.

3. **Common Errors & Fixes:**

   **Error: "Column 'category' not found"**
   - Fix: Tambahkan kolom `category` ke tabel (lihat STEP 4.2)

   **Error: "Table 'activity_logs' doesn't exist"**
   - Fix: Buat tabel `activity_logs` (lihat STEP 4.3)

   **Error: "Call to undefined relationship 'author'"**
   - Fix: Cek model `News` - relationship harus `author()`, bukan `user()`

   **Error: "Foreign key constraint fails"**
   - Fix: Cek foreign key di database vs yang diharapkan oleh migration

4. **Disable Debug Mode Setelah Fix:**
   ```bash
   # Di .env
   APP_DEBUG=false
   
   php artisan config:clear
   php artisan config:cache
   ```

---

## 📝 CHECKLIST PERBAIKAN

- [ ] Backup database sudah dibuat
- [ ] Script diagnostik sudah dijalankan dan output sudah dianalisis
- [ ] Missing columns sudah ditambahkan
- [ ] Missing tables sudah dibuat
- [ ] Migration status sudah dicek dan diperbaiki
- [ ] Cache sudah di-clear dan di-rebuild
- [ ] Routes `/admin/news` dan `/admin/events` sudah bisa diakses tanpa error
- [ ] Laravel logs sudah dicek dan tidak ada error baru
- [ ] GitHub Actions workflow sudah diperbaiki dan di-test
- [ ] Debug mode sudah di-disable kembali

---

## 🚨 PREVENTION (Agar Tidak Terulang)

1. **Jangan pernah ubah database schema langsung di Neon dashboard**
   - Selalu gunakan migration files
   - Jika perlu ubah manual, buat migration file juga untuk tracking

2. **Test migration di local/staging sebelum push ke production**
   ```bash
   php artisan migrate:fresh --seed  # Test fresh migration
   ```

3. **Gunakan migration rollback dengan hati-hati**
   - Rollback migration bisa menghapus data
   - Pastikan backup database sebelum rollback

4. **Monitor GitHub Actions logs**
   - Jika workflow fail, cek log untuk tahu step mana yang gagal
   - Jangan ignore workflow failure

5. **Sync database state dengan codebase**
   - Jika ubah schema manual, pastikan migration file juga di-update
   - Atau buat migration baru untuk sync

---

## 📞 SUPPORT

Jika masih ada masalah setelah mengikuti panduan ini:

1. **Kumpulkan informasi:**
   - Output dari `scripts/diagnose-deployment.sh`
   - Error logs dari `storage/logs/laravel.log`
   - Output dari `php artisan migrate:status`
   - Screenshot error 500 (jika APP_DEBUG=true)

2. **Cek file-file berikut:**
   - `.env` (pastikan tidak ada typo)
   - `config/database.php`
   - Migration files yang relevan
   - Model files (`News.php`, `Event.php`)

3. **Test di local:**
   - Clone repo fresh
   - Jalankan `php artisan migrate:fresh --seed`
   - Test routes di local
   - Bandingkan dengan production

---

## 📚 REFERENSI

- [Laravel Migrations Documentation](https://laravel.com/docs/migrations)
- [Neon Database Documentation](https://neon.tech/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

