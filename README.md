# 🎓 Alumni Site - Sistem Informasi & Jejaring Alumni

Platform web modern berbasis **Monolithic Architecture** yang dirancang untuk mengelola database alumni secara terpusat, memfasilitasi jejaring karir profesional, dan menyebarkan informasi kegiatan kampus.

Dibangun dengan teknologi terkini: **Laravel (Backend)** dan **React Inertia (Frontend)** menggunakan database **PostgreSQL**.

---

## 🌟 Fitur Unggulan

Berdasarkan analisis *source code*, aplikasi ini memiliki fitur mendalam sebagai berikut:

### 🚀 Fitur Publik (Guest)
* **Landing Page Interaktif:** Hero section dengan animasi partikel (*tsparticles*) dan statistik alumni real-time.
* **Alumni Directory:** Pencarian alumni berdasarkan nama, angkatan, atau jurusan.
* **Portal Berita & Event:** Informasi terkini kampus yang dapat diakses siapa saja.
* **Alumni of The Month:** Fitur *highlight* alumni berprestasi di halaman depan (dikelola Admin).
* **Job Board (Loker):** Informasi lowongan pekerjaan yang terbuka untuk umum.

### 🎓 Fitur Alumni (User Dashboard)
* **Two-Step Registration:**
  * **Step 1:** Verifikasi NIM/Data Akademik.
  * **Step 2:** Pembuatan akun pengguna.
* **Onboarding Wizard:** Panduan langkah demi langkah bagi pengguna baru untuk melengkapi profil.
* **Digital Alumni ID Card:** Generate otomatis kartu tanda alumni yang siap cetak/unduh.
* **Manajemen Karir & Profil:**
  * Riwayat Pekerjaan (*Job History*) & Pengalaman.
  * Keahlian (*Skills*) - Hard Skill & Soft Skill.
  * Tautan Sosial Media (LinkedIn, GitHub, dll).
* **Privasi Profil:** Opsi untuk menyembunyikan profil dari publik (*Private/Public Mode*).
* **Keamanan Akun:** Update password, ganti email, dan verifikasi email wajib.

### 🛠 Panel Administrator (Admin)
* **Dashboard Analitik:** Visualisasi total alumni, sebaran pekerjaan, dan metrik aktivitas.
* **Manajemen Master Data:**
  * **Verifikasi Alumni:** Validasi pendaftar baru (*Pending/Verified*).
  * **CRUD Data:** Kelola penuh data alumni, user, dan master skills.
* **Content Management System (CMS):**
  * Posting Berita/Artikel dengan kategori.
  * Manajemen Agenda/Event Reuni.
  * Manajemen Lowongan Kerja (*Jobs*).
* **Laporan & Ekspor Data:**
  * **Export PDF:** Unduh laporan data alumni format cetak (dompdf).
  * **Export Excel:** Unduh rekap data mentah (maatwebsite/excel).
* **Pengaturan Sistem:** Manajemen admin tambahan dan konfigurasi situs.

---

## 💻 Tech Stack

* **Backend:** Laravel 11/12 (PHP 8.2+)
* **Frontend:** React 19 + Inertia.js 2.0
* **Styling:** Tailwind CSS v4.0
* **Database:** PostgreSQL
* **Routing:** Ziggy (Use Laravel routes in React)
* **Build Tool:** Vite 7

---

## ⚙️ Panduan Instalasi Lengkap

Ikuti langkah-langkah ini dari awal hingga akhir untuk menjalankan proyek di Localhost.

### 1. Prasyarat Sistem
Pastikan software berikut sudah terinstall:
* **PHP >= 8.2** (Pastikan ekstensi `pdo_pgsql`, `pgsql`, dan `fileinfo` aktif di `php.ini`).
* **Composer** (Dependency Manager PHP).
* **Node.js & NPM** (Minimal v18+).
* **PostgreSQL** (Database Server).
* **Git**.

### 2. Clone Repository
```bash
git clone [https://github.com/username/alumni-site.git](https://github.com/username/alumni-site.git)
cd alumni-site
```

### 3. Install Dependensi
Install paket Backend (PHP) dan Frontend (JS):

```bash
composer install
npm install
```

### 4. Konfigurasi Environment (PostgreSQL)
Salin file konfigurasi contoh:

```bash
cp .env.example .env
```

Buka file `.env` dan sesuaikan konfigurasi database PostgreSQL kamu:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=alumni_site_db
DB_USERNAME=postgres
DB_PASSWORD=password_postgres_kamu
```

### 5. 📧 Konfigurasi Email (Sangat Disarankan: Mailtrap)
Aplikasi ini memiliki fitur **Verifikasi Email** dan **Lupa Password**. Untuk testing di localhost tanpa ribet setting SMTP Google, gunakan [**Mailtrap**](https://mailtrap.io/home).

1. Daftar akun gratis di [Mailtrap.io](https://mailtrap.io/home).
2. Buat "Inbox" baru.
3. Pilih integrasi "Laravel 9+" (atau salin kredensial SMTP-nya).
4. Update file `.env` kamu:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=username_mailtrap_kamu
MAIL_PASSWORD=password_mailtrap_kamu
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@alumni-site.test"
MAIL_FROM_NAME="${APP_NAME}"
```
*Dengan ini, semua email dari aplikasi akan masuk ke inbox Mailtrap, aman dan tidak nyasar ke user asli.*

### 6. Setup Database
Buat database kosong di PostgreSQL. Bisa lewat pgAdmin atau terminal:

```bash
# Contoh via terminal (masukkan password postgres saat diminta)
psql -U postgres -c "CREATE DATABASE alumni_site_db;"
```

### 7. Generate Key & Migrasi
Isi app key dan jalankan migrasi tabel beserta data dummy (seeder):

```bash
php artisan key:generate
php artisan migrate --seed
```

### 8. Link Storage (Wajib)
Agar fitur upload foto profil dan gambar berita berfungsi:

```bash
php artisan storage:link
```

### 9. Jalankan Aplikasi
Buka **dua terminal** terpisah agar backend dan frontend berjalan bersamaan:

**Terminal 1 (Laravel Server):**
```bash
php artisan serve
```

**Terminal 2 (Vite Build Process):**
```bash
npm run dev
```

Buka browser dan akses: `http://localhost:8000`

---

## 🔑 Akun Default (Seeder)

Gunakan akun berikut untuk login pertama kali:

| Role | Email | Password | Akses |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@alumni.com` | `password` | Dashboard Admin, CMS, User Management |
| **Alumni (User)** | `alumni@alumni.com` | `password` | Dashboard Alumni, Edit Profil, ID Card |

---

## 🐛 Troubleshooting

* **Error `could not find driver`:**
  Pastikan ekstensi `extension=pdo_pgsql` dan `extension=pgsql` di file `php.ini` sudah di-uncomment (hapus tanda `;` di depannya).
* **Tampilan Berantakan / CSS Hilang:**
  Pastikan `npm run dev` sedang berjalan di terminal.
* **Gambar Tidak Muncul:**
  Coba hapus folder `public/storage` lalu jalankan ulang `php artisan storage:link`.

## 📝 Lisensi

[MIT License](https://opensource.org/licenses/MIT)
