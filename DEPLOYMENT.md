# 🚀 Deployment Guide - Hostinger

Panduan lengkap untuk deploy aplikasi Alumni Site ke Hostinger.

**Dua Metode Deployment:**

| Fitur | 🚀 Metode Git | 📁 Metode Manual |
|-------|---------------|------------------|
| **Kesulitan** | Sedang (perlu Git & SSH) | Mudah (hanya File Manager) |
| **Update** | Mudah (`git pull`) | Manual upload ulang |
| **Version Control** | ✅ Terintegrasi | ❌ Tidak ada |
| **SSH Required** | ✅ Ya | ❌ Tidak (opsional) |
| **Cocok untuk** | Production, sering update | One-time deploy, pemula |
| **Auto-deploy** | ✅ Bisa setup webhook | ❌ Tidak |

**Rekomendasi:**
- **Gunakan Metode Git** jika Anda familiar dengan Git dan ingin mudah update di masa depan
- **Gunakan Metode Manual** jika ini deployment pertama kali dan ingin lebih simple

---

## 📋 Prasyarat

1. **Akun Hostinger** dengan akses ke:
   - **File Manager** (wajib - untuk upload file)
   - **Database Manager** (phpPgAdmin atau cPanel) - untuk setup database
   - **SSH Access** (opsional - hanya jika perlu run command `php artisan`)
   - Domain atau subdomain yang sudah dikonfigurasi

2. **Persiapan Lokal:**
   - Aplikasi sudah berjalan dengan baik di localhost
   - Semua test sudah passing
   - Build production sudah siap

### ⚠️ Kapan Butuh SSH/Putty?

**TIDAK PERLU SSH jika:**
- ✅ Upload file via File Manager
- ✅ Setup database via Database Manager
- ✅ Edit file `.env` via File Manager
- ✅ Set permission via File Manager

**PERLU SSH jika:**
- ⚠️ Ingin run command `php artisan migrate`
- ⚠️ Ingin run command `php artisan key:generate`
- ⚠️ Ingin run command `php artisan storage:link`
- ⚠️ Ingin run command `php artisan config:cache`

**Alternatif tanpa SSH:**
- Banyak command bisa dijalankan via **Hostinger's Terminal** di hPanel (jika tersedia)
- Atau jalankan semua command di lokal sebelum upload (recommended!)

---

## 🚀 METODE 1: Deployment via Git (Recommended)

Metode ini menggunakan Git/GitHub untuk deployment, lebih efisien dan mudah di-update.

### Keuntungan Metode Git:
- ✅ Mudah update (tinggal `git pull`)
- ✅ Version control terintegrasi
- ✅ Potensi auto-deploy dengan webhook
- ✅ Tidak perlu upload file manual berulang kali
- ✅ Lebih profesional dan scalable

### Step 1: Persiapan GitHub Repository

1. **Buat Repository di GitHub:**
   - Login ke GitHub
   - Buat repository baru (misalnya: `alumni-site`)
   - Jangan centang "Initialize with README" (karena kita sudah punya project)

2. **Inisialisasi Git di Project Lokal:**
   ```bash
   # Di folder project lokal
   git init
   git add .
   git commit -m "Initial commit - Alumni Site"
   git branch -M main
   git remote add origin https://github.com/username/alumni-site.git
   git push -u origin main
   ```

3. **Pastikan file penting sudah di-commit:**
   - ✅ Semua source code
   - ✅ `composer.json` dan `composer.lock`
   - ✅ `package.json` dan `package-lock.json`
   - ✅ `.env.example`
   - ❌ Jangan commit: `.env`, `vendor/`, `node_modules/`

### Step 2: Setup di Hostinger hPanel

1. **Buat Website Baru:**
   - Login ke hPanel Hostinger
   - Pilih **Websites** → **Add Website**
   - Pilih **Custom PHP** atau **HTML website**
   - Buat sebagai subdomain atau domain utama

2. **Setup Git di hPanel:**
   - Masuk ke **Advanced** → **Git**
   - Klik **Create**
   - Masukkan:
     - **Repository URL:** `https://github.com/username/alumni-site.git`
     - **Branch:** `main`
     - **Directory:** `domains/yourdomain.com/public_html` (atau sesuai path Anda)
   - Klik **Create**

3. **Cek PHP Version:**
   - Pastikan PHP version sudah **8.2 atau lebih tinggi**
   - Bisa diubah di **Advanced** → **PHP Configuration**

4. **Aktifkan SSH:**
   - Pastikan **SSH Status** sudah aktif
   - Download SSH credentials (IP, Port, Username) dari hPanel

### Step 3: Install Dependencies via SSH

1. **Login ke SSH:**
   ```bash
   # Windows: Gunakan Putty atau PowerShell
   ssh username@your-server-ip -p port
   
   # Mac/Linux: Gunakan Terminal
   ssh username@your-server-ip -p port
   ```

2. **Masuk ke Direktori Project:**
   ```bash
   cd domains/yourdomain.com/public_html
   # atau
   cd public_html
   ```

3. **Pull dari GitHub:**
   ```bash
   git pull origin main
   ```

4. **Install Composer Dependencies:**
   
   **Opsi A: Gunakan Composer.phar (Recommended - untuk menghindari versi lama)**
   
   Download composer.phar di lokal:
   ```bash
   # Di lokal, download composer.phar
   curl -sS https://getcomposer.org/installer | php
   ```
   
   Commit composer.phar ke GitHub:
   ```bash
    git add composer.phar
   git commit -m "Add composer.phar"
   git push origin main
   ```
   
   Di server, pull dan install:
   ```bash
   git pull origin main
   php composer.phar install --optimize-autoloader --no-dev
   ```
   
   **Opsi B: Gunakan Composer Global (jika sudah terinstall di server)**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

5. **Install NPM Dependencies & Build:**
   ```bash
   npm install
   npm run build
   ```

### Step 4: Setup Database & Environment

1. **Buat Database di hPanel:**
   - Masuk ke **Database** → **PostgreSQL Databases**
   - Buat database baru (contoh: `alumni_site_db`)
   - Buat user baru dan berikan akses
   - Catat: Database Name, Username, Password, Host

2. **Buat File .env:**
   ```bash
   # Di SSH
   cd domains/yourdomain.com/public_html
   cp .env.example .env
   nano .env
   ```
   
   Atau via **File Manager**:
   - Upload `.env.example` ke `public_html`
   - Rename menjadi `.env`
   - Edit dan isi dengan konfigurasi:
   
   ```dotenv
   APP_NAME="Alumni Site"
   APP_ENV=production
   APP_KEY=
   APP_DEBUG=false
   APP_TIMEZONE=Asia/Jakarta
   APP_URL=https://yourdomain.com
   
   DB_CONNECTION=pgsql
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   
   LOG_CHANNEL=production
   LOG_STACK=daily
   LOG_LEVEL=error
   ```

3. **Generate App Key:**
   ```bash
   php artisan key:generate
   ```

4. **Run Migrations:**
   ```bash
   php artisan migrate --force
   ```

5. **Link Storage:**
   ```bash
   php artisan storage:link
   ```

### Step 5: Setup URL tanpa /public

Secara default, Laravel perlu diakses via `/public`. Untuk menghilangkan `/public` dari URL:

1. **Pindahkan File dari `public/` ke Root:**
   - Pindahkan `.htaccess` dari `public/` ke `public_html/`
   - Pindahkan `index.php` dari `public/` ke `public_html/`
   - Pindahkan `favicon.ico` (jika ada) ke `public_html/`
   - Pindahkan `robots.txt` (jika ada) ke `public_html/`

2. **Edit `index.php` di Root:**
   
   Buka `public_html/index.php` dan ubah path:
   
   **Dari:**
   ```php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   ```
   
   **Menjadi:**
   ```php
   require __DIR__.'/vendor/autoload.php';
   $app = require_once __DIR__.'/bootstrap/app.php';
   ```

3. **Commit Perubahan:**
   ```bash
   # Di lokal
   git add .
   git commit -m "Move public files to root for clean URL"
   git push origin main
   
   # Di server
   git pull origin main
   ```

4. **Set Permission:**
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

### Step 6: Optimize untuk Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 7: Update di Masa Depan

Untuk update aplikasi di masa depan, cukup:

```bash
# Di server via SSH
cd domains/yourdomain.com/public_html
git pull origin main
php composer.phar install --optimize-autoloader --no-dev
npm install
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📁 METODE 2: Deployment Manual (Alternatif)

Metode ini menggunakan File Manager untuk upload file secara manual. Cocok jika tidak ingin menggunakan Git atau SSH.

> **Note:** Jika Anda sudah menggunakan Metode Git di atas, skip bagian ini.

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

**Via File Manager (Paling Mudah - Recommended):**
1. Login ke hPanel Hostinger
2. Buka **File Manager**
3. Navigasi ke `public_html` (atau folder domain/subdomain Anda)
4. Upload semua file yang sudah disiapkan (bisa ZIP dulu, lalu extract di server)
5. Extract jika menggunakan ZIP (klik kanan → Extract)

**Via SSH (Opsional - untuk yang sudah familiar dengan command line):**
Jika Anda lebih nyaman dengan command line, bisa menggunakan SSH:
- **Windows:** Gunakan Putty atau PowerShell (Windows 10+)
- **Mac/Linux:** Gunakan Terminal built-in

```bash
# Connect ke server
ssh username@your-server-ip

# Navigate ke public_html
cd public_html

# Upload via SCP dari lokal (jalankan di terminal lokal)
scp -r ./alumni-site/* username@your-server-ip:/home/username/public_html/
```

**Catatan:** File Manager sudah cukup untuk deployment. SSH hanya diperlukan jika Anda ingin menjalankan command seperti `php artisan migrate` langsung di server.

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

**Via File Manager (Paling Mudah):**
1. Di File Manager, navigasi ke root aplikasi (misalnya `/home/username/alumni-site/`)
2. Klik **New File**
3. Beri nama: `.env`
4. Klik kanan file → **Edit**
5. Copy-paste isi dari template di bawah

**Via SSH (Opsional):**
```bash
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

**Opsi 1: Generate di Lokal (Recommended - Tidak Perlu SSH)**
Jalankan di komputer lokal Anda sebelum upload:
```bash
php artisan key:generate
```
Copy isi `APP_KEY=` dari `.env` lokal ke `.env` di server.

**Opsi 2: Generate di Server (Perlu SSH atau Terminal hPanel)**
```bash
cd /home/username/alumni-site
php artisan key:generate
```

### 3.4 Set Permission

**Via File Manager (Paling Mudah):**
1. Di File Manager, klik kanan folder `storage` → **Change Permissions**
2. Set ke `775` (atau `755`)
3. Ulangi untuk folder `bootstrap/cache`
4. Centang **Recursive** untuk apply ke semua subfolder

**Via SSH (Opsional):**
```bash
# Set permission untuk storage dan bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 🗃️ Step 4: Migrasi Database

### 4.1 Jalankan Migrasi

**Opsi 1: Import SQL Manual (Tidak Perlu SSH)**
1. Di lokal, export database:
   ```bash
   pg_dump -U postgres alumni_site_db > database.sql
   ```
2. Di Hostinger Database Manager, import file `database.sql`

**Opsi 2: Via Artisan Command (Perlu SSH atau Terminal hPanel)**
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

**Opsi 1: Manual Link (Tidak Perlu SSH)**
1. Di File Manager, buat folder `storage` di dalam `public/`
2. Atau copy folder `storage/app/public` ke `public/storage`

**Opsi 2: Via Artisan (Perlu SSH atau Terminal hPanel)**
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

