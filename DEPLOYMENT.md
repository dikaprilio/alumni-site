# 🚀 Deployment Guide - Hostinger

Panduan lengkap untuk deploy aplikasi Alumni Site ke Hostinger.

> **⚠️ PENTING:** Aplikasi ini menggunakan **PostgreSQL**, jadi **HARUS menggunakan VPS** (bukan shared hosting). Jika Anda sudah membeli VPS, ikuti panduan **"Deployment di VPS"** di bawah ini.

---

## 🖥️ DEPLOYMENT DI VPS (PostgreSQL Required)

Panduan ini khusus untuk deployment di **VPS Hostinger** dengan hPanel. VPS memberikan akses penuh untuk install PostgreSQL dan konfigurasi yang diperlukan.

### ⚡ Quick Start (Ringkasan)

**Alur deployment VPS secara singkat:**

1. ✅ **Login ke VPS via SSH** → Install PostgreSQL, PHP, Composer, Node.js
2. ✅ **Setup Database** → Buat database dan user PostgreSQL
3. ✅ **Clone Repository** → Deploy aplikasi via Git (via SSH atau hPanel)
4. ✅ **Install Dependencies** → `composer install` dan `npm install && npm run build`
5. ✅ **Setup Environment** → Buat file `.env` dan generate app key
6. ✅ **Run Migrations** → `php artisan migrate`
7. ✅ **Konfigurasi Web Server** → Setup Nginx/Apache
8. ✅ **Setup SSL** → Install SSL certificate dengan Certbot
9. ✅ **Setup Cron Job** → Untuk Laravel scheduler
10. ✅ **Test Aplikasi** → Verifikasi semua fitur berjalan

**Waktu estimasi:** 30-60 menit (tergantung pengalaman)

---

### 📋 Prasyarat VPS

1. **VPS Hostinger** sudah aktif dengan akses:
   - ✅ **SSH Access** (wajib - untuk install software)
   - ✅ **hPanel** (untuk manajemen website)
   - ✅ **Root/Sudo Access** (untuk install PostgreSQL, PHP, dll)
   - ✅ Domain sudah terhubung ke VPS

2. **Persiapan Lokal:**
   - Aplikasi sudah berjalan dengan baik di localhost
   - Semua test sudah passing
   - Repository Git sudah siap (GitHub/GitLab)

---

## 🚀 Step 1: Setup Awal VPS via SSH

### 1.1 Login ke VPS

```bash
# Windows: Gunakan PowerShell atau Putty
ssh root@your-vps-ip
# atau
ssh username@your-vps-ip

# Masukkan password saat diminta
```

**Info SSH dari hPanel:**
- Login ke hPanel → **SSH Access** → Catat IP, Port, Username, Password

> **💡 Tips hPanel:** Beberapa langkah bisa dilakukan via hPanel GUI:
> - **File Manager:** Untuk upload/edit file tanpa SSH
> - **Terminal:** Untuk menjalankan command tanpa SSH (jika tersedia)
> - **Database Manager:** Untuk manage database via GUI (opsional)

### 1.2 Update System

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 1.3 Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib -y

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib -y
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Verifikasi PostgreSQL:**
```bash
sudo systemctl status postgresql
psql --version
```

### 1.4 Setup Database PostgreSQL

**Opsi A: Via SSH (Recommended)**

```bash
# Login sebagai user postgres
sudo -u postgres psql

# Di dalam psql, buat database dan user
CREATE DATABASE alumni_site_db;
CREATE USER alumni_user WITH PASSWORD 'your_secure_password_here';
ALTER ROLE alumni_user SET client_encoding TO 'utf8';
ALTER ROLE alumni_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE alumni_user SET timezone TO 'Asia/Jakarta';
GRANT ALL PRIVILEGES ON DATABASE alumni_site_db TO alumni_user;
\q
```

**Opsi B: Via hPanel Database Manager (Jika Tersedia)**

1. Login ke hPanel
2. Buka **Database** → **PostgreSQL Databases**
3. Klik **Create Database**
4. Masukkan:
   - Database Name: `alumni_site_db`
   - Username: `alumni_user`
   - Password: `your_secure_password_here` (gunakan password yang kuat!)
5. Klik **Create**

**Catat informasi database:**
- Database: `alumni_site_db`
- Username: `alumni_user`
- Password: `your_secure_password_here`
- Host: `localhost` (atau sesuai info dari hPanel)
- Port: `5432`

### 1.5 Install PHP 8.2+ dan Ekstensi

```bash
# Ubuntu/Debian
sudo apt install php8.2 php8.2-fpm php8.2-cli php8.2-common \
    php8.2-pgsql php8.2-mbstring php8.2-xml php8.2-curl \
    php8.2-zip php8.2-gd php8.2-fileinfo php8.2-tokenizer -y

# CentOS/RHEL (perlu EPEL repository)
sudo yum install epel-release -y
sudo yum install php82 php82-php-fpm php82-php-cli php82-php-pgsql \
    php82-php-mbstring php82-php-xml php82-php-curl \
    php82-php-zip php82-php-gd -y
```

**Verifikasi PHP:**
```bash
php -v
php -m | grep pgsql
```

### 1.6 Install Composer

```bash
cd ~
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
composer --version
```

### 1.7 Install Node.js dan NPM

```bash
# Install Node.js 18+ (menggunakan NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi
node --version
npm --version
```

**Atau untuk CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 1.8 Install Web Server (Nginx atau Apache)

**Opsi A: Nginx (Recommended)**
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

**Opsi B: Apache**
```bash
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2
```

---

## 🚀 Step 2: Deploy Aplikasi via Git

### 2.1 Clone Repository

**Opsi A: Via SSH (Recommended)**

```bash
# Masuk ke direktori web
# Hostinger VPS biasanya menggunakan salah satu struktur berikut:

# Struktur 1: /home/username/domains/yourdomain.com/public_html
cd ~/domains/yourdomain.com
git clone https://github.com/username/alumni-site.git
cd alumni-site

# Struktur 2: /var/www/html atau /var/www/yourdomain.com
cd /var/www
git clone https://github.com/username/alumni-site.git
cd alumni-site

# Struktur 3: /home/username/public_html
cd ~/public_html
git clone https://github.com/username/alumni-site.git
cd alumni-site
```

**💡 Tips:** Cek path website Anda di hPanel:
- Login ke hPanel → **Websites** → Lihat **Document Root** atau **Path**
- Gunakan path tersebut untuk clone repository

**Opsi B: Via hPanel Git (Lebih Mudah)**

1. Login ke hPanel
2. Buka **Advanced** → **Git**
3. Klik **Create**
4. Masukkan:
   - **Repository URL:** `https://github.com/username/alumni-site.git`
   - **Branch:** `main` (atau `master`)
   - **Directory:** `/var/www/alumni-site` (atau sesuai path website Anda)
5. Klik **Create**
6. hPanel akan otomatis clone repository

**Catatan:** Setelah clone via hPanel, Anda masih perlu SSH untuk install dependencies dan setup.

### 2.2 Install Dependencies

```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
npm install

# Build assets untuk production
npm run build
```

### 2.3 Setup Environment File

**Opsi A: Via SSH**

```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env
nano .env
```

**Opsi B: Via hPanel File Manager (Lebih Mudah)**

1. Login ke hPanel
2. Buka **File Manager**
3. Navigasi ke folder aplikasi (misalnya `/var/www/alumni-site`)
4. Cari file `.env.example`
5. Klik kanan → **Copy**
6. Rename copy menjadi `.env`
7. Klik kanan `.env` → **Edit**
8. Edit sesuai konfigurasi di bawah

**Isi konfigurasi `.env`:**
```dotenv
APP_NAME="Alumni Site"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://yourdomain.com

# Database PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=alumni_site_db
DB_USERNAME=alumni_user
DB_PASSWORD=your_secure_password_here

LOG_CHANNEL=production
LOG_STACK=daily
LOG_LEVEL=error

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Mail (sesuaikan dengan SMTP Anda)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yourdomain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

**Generate App Key:**
```bash
php artisan key:generate
```

### 2.4 Setup Database

**⚠️ PENTING - CHECK CONSTRAINTS TERLEBIH DAHULU:**

Sebelum run migration, pastikan tidak ada data yang melanggar constraint:

```bash
# Check constraint violations
php artisan db:check-constraints
```

Jika ada violations, fix terlebih dahulu:
- Review file `fix_constraint_violations.sql` untuk cleanup script
- Atau gunakan SQL script langsung: `psql -U your_user -d your_database -f fix_constraint_violations.sql`

**Setelah semua clean, baru run migrations:**

```bash
# Run migrations (termasuk cache table untuk rate limiting)
php artisan migrate --force

# (Opsional) Seed data awal
php artisan db:seed --force
```

**⚠️ PENTING:** Migration akan membuat tabel `cache` dan `cache_locks` yang diperlukan untuk:
- Rate limiting (throttle middleware)
- Session storage (jika menggunakan database)
- Application cache

**Migration juga akan:**
- Enforce 1:1 relationship antara Users dan Alumnis (unique constraint pada `user_id`)
- Fix composite key pada tabel `alumni_skill` (composite primary key)

Pastikan migration berjalan dengan sukses. Jika ada error, cek log: `storage/logs/laravel.log`

### 2.5 Setup Storage dan Permissions

```bash
# Link storage
php artisan storage:link

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 2.6 Optimize untuk Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2.7 Struktur Folder di Hostinger VPS

Pastikan struktur folder seperti ini:

```
/home/username/domains/yourdomain.com/
├── alumni-site/              # Root aplikasi Laravel
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/               # Folder ini akan menjadi document root
│   │   ├── index.php
│   │   ├── .htaccess
│   │   └── build/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   └── artisan
└── public_html/              # Document root (jika menggunakan struktur ini)
    └── (symlink atau copy dari public/)
```

**Atau struktur yang lebih sederhana:**

```
/home/username/public_html/   # Document root
├── app/
├── bootstrap/
├── config/
├── database/
├── public/                   # Isi folder ini sudah di root
│   ├── index.php
│   ├── .htaccess
│   └── build/
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env
└── artisan
```

**💡 Tips hPanel:**
- Di hPanel, Anda bisa set **Document Root** di **Websites** → **Manage** → **Settings**
- Pastikan document root mengarah ke folder `public/` dari aplikasi Laravel
- Contoh: `/home/username/domains/yourdomain.com/alumni-site/public`

---

## 🌐 Step 3: Konfigurasi Web Server

### 3.1 Konfigurasi Nginx

Buat file konfigurasi Nginx:

```bash
sudo nano /etc/nginx/sites-available/alumni-site
```

**Isi konfigurasi:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    # Sesuaikan path dengan struktur folder Hostinger Anda
    root /home/username/domains/yourdomain.com/alumni-site/public;
    # atau
    # root /var/www/alumni-site/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Aktifkan konfigurasi:**
```bash
# Buat symlink
sudo ln -s /etc/nginx/sites-available/alumni-site /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3.2 Konfigurasi Apache (Alternatif)

Jika menggunakan Apache, edit file konfigurasi:

```bash
sudo nano /etc/apache2/sites-available/alumni-site.conf
```

**Isi konfigurasi:**
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    # Sesuaikan path dengan struktur folder Hostinger Anda
    DocumentRoot /home/username/domains/yourdomain.com/alumni-site/public
    # atau
    # DocumentRoot /var/www/alumni-site/public

    <Directory /home/username/domains/yourdomain.com/alumni-site/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/alumni-site_error.log
    CustomLog ${APACHE_LOG_DIR}/alumni-site_access.log combined
</VirtualHost>
```

**Aktifkan:**
```bash
sudo a2ensite alumni-site.conf
sudo a2enmod rewrite
sudo systemctl reload apache2
```

---

## 🔒 Step 4: Setup SSL (HTTPS)

### 4.1 Install Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y
# atau untuk Apache
sudo apt install certbot python3-certbot-apache -y
```

### 4.2 Generate SSL Certificate

**Untuk Nginx:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Untuk Apache:**
```bash
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

Certbot akan otomatis:
- Generate certificate
- Update konfigurasi web server
- Setup auto-renewal

---

## ⏰ Step 5: Setup Cron Job (Laravel Scheduler)

Laravel memerlukan cron job untuk menjalankan scheduled tasks:

```bash
sudo crontab -e -u www-data
```

**Tambahkan baris berikut (sesuaikan path):**
```cron
# Sesuaikan path dengan struktur folder Anda
* * * * * cd /home/username/domains/yourdomain.com/alumni-site && php artisan schedule:run >> /dev/null 2>&1
# atau
# * * * * * cd /var/www/alumni-site && php artisan schedule:run >> /dev/null 2>&1
```

**Atau jika menggunakan user lain:**
```bash
sudo crontab -e
# Tambahkan (sesuaikan path):
* * * * * cd /home/username/domains/yourdomain.com/alumni-site && php artisan schedule:run >> /dev/null 2>&1
```

**💡 Tips hPanel:**
- Beberapa hPanel memiliki fitur **Cron Jobs** di menu **Advanced**
- Anda bisa setup cron job via GUI tanpa perlu SSH

---

## 🔥 Step 6: Setup Firewall (Opsional tapi Disarankan)

```bash
# Install UFW (Ubuntu)
sudo apt install ufw -y

# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
# atau untuk Apache
sudo ufw allow 'Apache Full'

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## ✅ Step 7: Verifikasi Deployment

### 7.1 Test Aplikasi

1. Buka browser dan akses: `https://yourdomain.com`
2. Test halaman utama
3. Test login (admin dan alumni)
4. Test upload gambar
5. Test semua fitur utama

### 7.2 Check Logs

```bash
# Laravel logs (sesuaikan path)
tail -f /home/username/domains/yourdomain.com/alumni-site/storage/logs/laravel.log
# atau
# tail -f /var/www/alumni-site/storage/logs/laravel.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### 7.3 Check Services

```bash
# Check status semua service
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status php8.2-fpm
```

---

## 🔄 Update Aplikasi di Masa Depan

Ketika ada update baru:

```bash
# Masuk ke direktori aplikasi (sesuaikan path)
cd /home/username/domains/yourdomain.com/alumni-site
# atau
# cd /var/www/alumni-site

# Pull update dari Git
git pull origin main

# Install dependencies baru (jika ada)
composer install --optimize-autoloader --no-dev
npm install
npm run build

# Run migrations baru (jika ada)
php artisan migrate --force

# Clear dan re-cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🐛 Troubleshooting VPS

### Error: "Connection refused" ke PostgreSQL

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL jika tidak running
sudo systemctl start postgresql

# Check PostgreSQL listening
sudo netstat -tlnp | grep postgres
```

### Error: "Permission denied" untuk storage

```bash
# Fix permissions (sesuaikan path)
sudo chown -R www-data:www-data /home/username/domains/yourdomain.com/alumni-site/storage
sudo chmod -R 775 /home/username/domains/yourdomain.com/alumni-site/storage
# atau
# sudo chown -R www-data:www-data /var/www/alumni-site/storage
# sudo chmod -R 775 /var/www/alumni-site/storage
```

### Error: "502 Bad Gateway" (Nginx)

```bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm

# Check socket path di nginx config
# Pastikan: fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
```

### Error: CSS/JS tidak muncul

```bash
# Rebuild assets (sesuaikan path)
cd /home/username/domains/yourdomain.com/alumni-site
npm run build
# atau
# cd /var/www/alumni-site
# npm run build

# Clear cache
php artisan config:clear
php artisan view:clear
```

---

## 📋 Checklist Deployment VPS

- [ ] VPS sudah aktif dengan SSH access
- [ ] PostgreSQL sudah terinstall dan running
- [ ] Database dan user sudah dibuat
- [ ] PHP 8.2+ dengan ekstensi pgsql sudah terinstall
- [ ] Composer sudah terinstall
- [ ] Node.js dan NPM sudah terinstall
- [ ] Web server (Nginx/Apache) sudah terinstall
- [ ] Repository sudah di-clone ke server
- [ ] Dependencies sudah di-install (composer & npm)
- [ ] Assets sudah di-build (`npm run build`)
- [ ] File `.env` sudah dikonfigurasi
- [ ] App key sudah di-generate
- [ ] Migrations sudah dijalankan
- [ ] Storage link sudah dibuat
- [ ] Permissions sudah di-set dengan benar
- [ ] Web server sudah dikonfigurasi
- [ ] SSL certificate sudah di-setup
- [ ] Cron job sudah di-setup
- [ ] Firewall sudah dikonfigurasi (opsional)
- [ ] Aplikasi sudah di-test dan berjalan dengan baik

---

## 📁 METODE DEPLOYMENT UNTUK SHARED HOSTING (TIDAK DISARANKAN)

> **⚠️ CATATAN:** Metode di bawah ini untuk **shared hosting** yang biasanya **TIDAK mendukung PostgreSQL**. Karena aplikasi ini menggunakan PostgreSQL, **disarankan menggunakan VPS** seperti yang dijelaskan di atas.

**Dua Metode Deployment untuk Shared Hosting:**

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

## 📋 Prasyarat (Shared Hosting)

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

### ⚠️ Troubleshooting: Error "npm: command not found"

Jika Anda mendapat error `npm: command not found` di server, ini **NORMAL** karena:
- Shared hosting (termasuk Hostinger) biasanya **TIDAK memiliki Node.js/npm**
- **Solusi:** Build assets di lokal sebelum deploy, lalu commit `public/build/` ke Git

**Langkah cepat:**
```bash
# Di lokal
npm run build
git add -f public/build
git commit -m "Add build assets"
git push origin main

# Di server
git pull origin main
# File build sudah ter-download, tidak perlu npm!
```

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

2. **Build Assets untuk Production (PENTING!):**
   ```bash
   # Di folder project lokal, build assets dulu
   npm install
   npm run build
   ```
   
   ⚠️ **PENTING:** Ini harus dilakukan SEBELUM commit karena server hosting biasanya tidak punya Node.js/npm!

3. **Inisialisasi Git di Project Lokal:**
   ```bash
   # Di folder project lokal
   git init
   
   # Force-add folder build (karena ada di .gitignore)
   git add -f public/build
   git add .
   git commit -m "Initial commit - Alumni Site"
   git branch -M main
   git remote add origin https://github.com/username/alumni-site.git
   git push -u origin main
   ```

4. **Pastikan file penting sudah di-commit:**
   - ✅ Semua source code
   - ✅ `composer.json` dan `composer.lock`
   - ✅ `package.json` dan `package-lock.json`
   - ✅ `.env.example`
   - ✅ `public/build/` (folder build assets - **WAJIB!** gunakan `git add -f public/build`)
   - ❌ Jangan commit: `.env`, `vendor/`, `node_modules/`
   
   **Catatan:** `public/build/` ada di `.gitignore` untuk development, tapi untuk deployment ke shared hosting tanpa npm, kita perlu commit folder ini. Gunakan `git add -f public/build` untuk force-add.

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

5. **Build Frontend Assets:**

   ⚠️ **PENTING:** Banyak shared hosting (termasuk Hostinger) **TIDAK memiliki Node.js/npm** di server. 
   
   **Solusi: Build di Lokal SEBELUM Deploy (Recommended):**
   
   File `public/build/` sudah seharusnya sudah di-build dan di-commit di Step 1. Jika belum:
   
   ```bash
   # Di komputer lokal, sebelum push ke GitHub
   npm install
   npm run build
   
   # Force-add folder build (karena ada di .gitignore)
   git add -f public/build
   git commit -m "Add production build assets"
   git push origin main
   ```
   
   File `public/build/` yang sudah di-build akan ter-upload ke server via Git, jadi tidak perlu `npm` di server.
   
   **Jika npm tidak tersedia di server (sudah terjadi):**
   - ✅ **Solusi:** Build di lokal, lalu commit `public/build/` dengan `git add -f public/build`
   - ✅ Pull ulang di server: `git pull origin main`
   - ✅ File build akan ter-download otomatis
   - ❌ **JANGAN** coba install npm di server (tidak akan berhasil di shared hosting)
   
   **Alternatif: Jika Server Punya Node.js (sangat jarang di shared hosting):**
   ```bash
   # Cek apakah Node.js tersedia
   which node
   which npm
   
   # Jika tersedia, baru bisa:
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

Untuk update aplikasi di masa depan:

**1. Di Komputer Lokal:**
```bash
# Pull update terbaru
git pull origin main

# Install dependencies baru (jika ada)
composer install --optimize-autoloader --no-dev
npm install

# Build assets untuk production
npm run build

# Force-add build assets (karena ada di .gitignore)
git add -f public/build
git commit -m "Update production build"
git push origin main
```

**2. Di Server via SSH:**
```bash
cd domains/yourdomain.com/public_html
git pull origin main
php composer.phar install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Catatan:** Tidak perlu `npm install` atau `npm run build` di server karena sudah di-build di lokal dan di-commit ke Git.

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

