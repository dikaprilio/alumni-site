# 🚀 Deployment Guide - Hostinger

Panduan lengkap untuk deploy aplikasi Alumni Site ke Hostinger.

---

## 📋 Prasyarat

1. **Akun Hostinger** dengan akses ke:
   - File Manager atau SSH
   - Database Manager (phpPgAdmin atau cPanel)
   - Domain atau subdomain yang sudah dikonfigurasi

2. **Persiapan Lokal:**
   - Aplikasi sudah berjalan dengan baik di localhost
   - Semua test sudah passing
   - Build production sudah siap

---

## 🔧 Step 1: Persiapan Build Production

### 1.1 Optimize untuk Production

Jalankan perintah berikut di lokal sebelum upload:

```bash
# Install dependencies (tanpa dev dependencies)
composer install --optimize-autoloader --no-dev

# Build assets untuk production
npm run build

# Clear dan cache config
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 1.2 File yang Perlu Diupload

Upload file/folder berikut ke server:
- ✅ `app/`
- ✅ `bootstrap/`
- ✅ `config/`
- ✅ `database/` (hanya folder `migrations/` dan `seeders/`)
- ✅ `public/`
- ✅ `resources/` (hanya untuk reference, sudah di-build)
- ✅ `routes/`
- ✅ `storage/` (pastikan folder `storage/app`, `storage/framework`, `storage/logs` ada)
- ✅ `vendor/`
- ✅ `artisan`
- ✅ `composer.json`
- ✅ `composer.lock`
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `.htaccess` (jika menggunakan Apache)

**JANGAN upload:**
- ❌ `.env` (buat baru di server)
- ❌ `node_modules/`
- ❌ `.git/`
- ❌ `storage/logs/*.log`
- ❌ `tests/`

---

## 🌐 Step 2: Setup di Hostinger

### 2.1 Upload File ke Server

**Via File Manager:**
1. Login ke hPanel Hostinger
2. Buka File Manager
3. Navigasi ke `public_html` (atau folder domain/subdomain Anda)
4. Upload semua file yang sudah disiapkan
5. Extract jika menggunakan ZIP

**Via SSH (Recommended):**
```bash
# Connect ke server
ssh username@your-server-ip

# Navigate ke public_html
cd public_html

# Upload via SCP dari lokal (jalankan di terminal lokal)
scp -r ./alumni-site/* username@your-server-ip:/home/username/public_html/
```

### 2.2 Struktur Folder di Hostinger

Pastikan struktur folder seperti ini:
```
public_html/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/          # Folder ini harus menjadi document root
├── resources/
├── routes/
├── storage/
├── vendor/
├── artisan
├── composer.json
└── .htaccess
```

**PENTING:** Di Hostinger, biasanya `public_html` adalah document root. Anda perlu:
1. Pindahkan semua isi folder `public/` ke `public_html/`
2. Pindahkan folder lain ke level di atas `public_html/` (misalnya `home/username/alumni-site/`)
3. Update path di `public_html/index.php` dan `.htaccess`

**Atau gunakan struktur ini (Recommended):**
```
home/username/
├── alumni-site/        # Root aplikasi
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/         # Isi folder ini dipindah ke public_html
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   └── artisan
└── public_html/        # Document root
    ├── index.php       # Update path ke ../alumni-site
    ├── .htaccess
    └── assets/         # Build files dari public/
```

### 2.3 Update `public_html/index.php`

Edit `public_html/index.php`:
```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Update path ini sesuai struktur folder Anda
require __DIR__.'/../alumni-site/vendor/autoload.php';

$app = require_once __DIR__.'/../alumni-site/bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
```

### 2.4 Update `.htaccess` di `public_html`

Pastikan `.htaccess` ada dan berisi:
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 🗄️ Step 3: Setup Database PostgreSQL

### 3.1 Buat Database di Hostinger

1. Login ke hPanel Hostinger
2. Buka **Database** → **PostgreSQL Databases**
3. Buat database baru (contoh: `alumni_site_db`)
4. Buat user baru dan berikan akses ke database
5. Catat: **Database Name**, **Username**, **Password**, **Host** (biasanya `localhost`)

### 3.2 Konfigurasi `.env` di Server

Buat file `.env` di root aplikasi (bukan di `public_html`):

```bash
# Via SSH
cd /home/username/alumni-site
nano .env
```

Isi dengan konfigurasi berikut:
```dotenv
APP_NAME="Alumni Site"
APP_ENV=production
APP_KEY=                    # Generate dengan: php artisan key:generate
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://yourdomain.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=production
LOG_STACK=daily
LOG_LEVEL=error
LOG_DEPRECATIONS_CHANNEL=null

# Database PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

# Cache
CACHE_STORE=database
CACHE_PREFIX=

# Queue
QUEUE_CONNECTION=database

# Mail (Gunakan SMTP Hostinger atau service lain)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yourdomain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

# File Storage
FILESYSTEM_DISK=local
```

### 3.3 Generate App Key

```bash
cd /home/username/alumni-site
php artisan key:generate
```

### 3.4 Set Permission

```bash
# Set permission untuk storage dan bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 🗃️ Step 4: Migrasi Database

### 4.1 Jalankan Migrasi

```bash
cd /home/username/alumni-site
php artisan migrate --force
```

**Catatan:** Flag `--force` diperlukan karena di production mode.

### 4.2 (Opsional) Seed Data Awal

Jika perlu data awal:
```bash
php artisan db:seed --class=DatabaseSeeder --force
```

---

## 🔗 Step 5: Link Storage

```bash
cd /home/username/alumni-site
php artisan storage:link
```

Pastikan symlink dibuat dari `public/storage` ke `storage/app/public`.

---

## ✅ Step 6: Verifikasi & Testing

### 6.1 Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Re-cache untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 6.2 Test Aplikasi

1. Buka browser dan akses domain Anda
2. Test halaman utama
3. Test login (admin dan alumni)
4. Test upload gambar
5. Test semua fitur utama

### 6.3 Check Logs

```bash
tail -f storage/logs/laravel.log
```

---

## 🔒 Step 7: Security Hardening

### 7.1 Set Permission File

```bash
# File permission
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Storage dan cache harus writable
chmod -R 775 storage bootstrap/cache
```

### 7.2 Protect `.env`

Pastikan `.env` tidak bisa diakses via web:
```apache
# Tambahkan di .htaccess di public_html
<Files .env>
    Order allow,deny
    Deny from all
</Files>
```

### 7.3 Disable Directory Listing

```apache
# Tambahkan di .htaccess
Options -Indexes
```

---

## 📧 Step 8: Setup Email (Opsional)

### Opsi 1: SMTP Hostinger
Gunakan SMTP yang disediakan Hostinger (sudah dikonfigurasi di `.env`).

### Opsi 2: Mailtrap (Development)
Untuk testing, gunakan Mailtrap (lihat README.md).

### Opsi 3: SendGrid / Mailgun
Untuk production yang lebih reliable, gunakan service email profesional.

---

## 🐛 Troubleshooting

### Error: "No application encryption key has been specified"
```bash
php artisan key:generate
```

### Error: "The stream or file could not be opened"
```bash
chmod -R 775 storage bootstrap/cache
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"
- Check database credentials di `.env`
- Pastikan PostgreSQL service berjalan
- Check firewall rules

### Error: "Class 'X' not found"
```bash
composer install --optimize-autoloader --no-dev
php artisan config:clear
php artisan config:cache
```

### CSS/JS tidak muncul
- Pastikan `npm run build` sudah dijalankan
- Check path di `vite.config.js`
- Clear browser cache

### 500 Internal Server Error
1. Check `storage/logs/laravel.log`
2. Check permission file
3. Check `.env` configuration
4. Enable `APP_DEBUG=true` sementara untuk debugging (jangan lupa disable lagi!)

---

## 🔄 Update Deployment

Ketika ada update baru:

```bash
# 1. Backup database
pg_dump -U username database_name > backup.sql

# 2. Pull update (jika menggunakan Git)
git pull origin main

# 3. Install dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build

# 4. Run migrations
php artisan migrate --force

# 5. Clear dan re-cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📞 Support

Jika mengalami masalah:
1. Check log: `storage/logs/laravel.log`
2. Hubungi support Hostinger
4. Check dokumentasi Laravel: https://laravel.com/docs

---

## ✅ Checklist Deployment

- [ ] Build production assets (`npm run build`)
- [ ] Upload semua file ke server
- [ ] Setup struktur folder dengan benar
- [ ] Buat database PostgreSQL
- [ ] Konfigurasi `.env` dengan benar
- [ ] Generate app key
- [ ] Set permission file dan folder
- [ ] Jalankan migrasi database
- [ ] Link storage
- [ ] Clear dan cache config
- [ ] Test semua fitur utama
- [ ] Setup email
- [ ] Security hardening
- [ ] Backup database

---

**Selamat! Aplikasi Anda sudah siap di production! 🎉**

