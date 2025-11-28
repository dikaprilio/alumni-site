# Prinsip Backend & OOP dalam Codebase

Dokumen ini menguraikan prinsip-prinsip Pemrograman Berorientasi Objek (OOP) utama dan konsep backend yang ditemukan dalam codebase `alumni-site`. Dokumen ini dirancang untuk membantu Anda menjelaskan logika backend selama presentasi Anda.

## 1. Enkapsulasi (Encapsulation)
**Definisi:** Enkapsulasi adalah pembungkusan data (atribut) dan metode (fungsi) yang beroperasi pada data tersebut menjadi satu unit tunggal (kelas), serta membatasi akses langsung ke beberapa komponen objek. Ini melindungi keadaan internal (internal state) dari sebuah objek.

### Contoh 1: `App\Models\User`
Di `User.php`, enkapsulasi ditunjukkan melalui penggunaan properti `protected` seperti `$fillable`, `$hidden`, dan `$casts`.

```php
// app/Models/User.php

class User extends Authenticatable implements MustVerifyEmail
{
    // Enkapsulasi: Membatasi atribut mana yang bisa diisi secara massal (mass-assigned)
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'has_seen_tour',
    ];

    // Enkapsulasi: Menyembunyikan data sensitif dari serialisasi array/JSON
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Enkapsulasi: Secara otomatis mengubah tipe data atribut ke tipe tertentu
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
```
**Penjelasan:** Keadaan internal (password, token) disembunyikan dari tampilan luar ketika model dikonversi menjadi array atau JSON, memastikan keamanan dan integritas data.

### Contoh 2: `App\Services\ImageUploadService`
Service ini mengenkapsulasi logika pemrosesan gambar internal dan instance library (`$manager`) di dalam kelas, hanya mengekspos metode publik yang diperlukan seperti `upload` dan `delete`.

```php
// app/Services/ImageUploadService.php

class ImageUploadService
{
    // Enkapsulasi: Instance image manager bersifat protected, tidak dapat diakses dari luar
    protected $manager;

    public function __construct()
    {
        // Setup internal disembunyikan dari pengguna service ini
        $this->manager = new ImageManager(new Driver());
    }

    // Public API: Hanya metode ini yang diekspos ke bagian lain dari aplikasi
    public function upload(UploadedFile $file, string $path, ...) { ... }
}
```
**Penjelasan:** Controller yang menggunakan service ini tidak perlu tahu bahwa `Intervention\Image` digunakan secara internal. Ia hanya memanggil `upload()`.

## 2. Pewarisan (Inheritance)
**Definisi:** Pewarisan adalah mekanisme di mana kelas baru (anak/subclass) menurunkan atribut dan metode dari kelas yang sudah ada (induk/superclass). Ini mempromosikan penggunaan kembali kode (code reusability).

### Contoh 1: `App\Http\Controllers\AuthController`
`AuthController` memperluas (extends) kelas dasar `Controller`.

```php
// app/Http/Controllers/AuthController.php

class AuthController extends Controller
{
    // Mewarisi metode dari kelas dasar Controller
    // ...
}
```
**Penjelasan:** `AuthController` mewarisi semua fungsionalitas dari `Controller` dasar Laravel, seperti penanganan middleware dan logika validasi, tanpa perlu menulis ulang.

### Contoh 2: `App\Http\Controllers\Admin\EventController`
`EventController` memperluas kelas dasar kustom `BaseContentController`.

```php
// app/Http/Controllers/Admin/EventController.php

class EventController extends BaseContentController
{
    // Mewarisi logika CRUD umum (index, store, update, destroy) dari BaseContentController
    // Hanya mengimplementasikan metode konfigurasi spesifik
    protected function getModel() { return Event::class; }
}
```
**Penjelasan:** `EventController` mewarisi seluruh alur kerja CRUD dari `BaseContentController`. Ia hanya perlu mendefinisikan *apa* yang berbeda (model, aturan validasi), sementara *bagaimana* caranya (menyimpan, redirect) diwariskan.

## 3. Polimorfisme (Polymorphism)
**Definisi:** Polimorfisme memungkinkan objek dari kelas yang berbeda diperlakukan sebagai objek dari superclass yang umum. Ini juga memungkinkan metode untuk melakukan hal yang berbeda berdasarkan objek yang sedang ditindaklanjuti (misalnya, method overriding).

### Contoh 1: `App\Notifications\CustomVerifyEmail`
Kelas ini memperluas `VerifyEmail` dan menimpa (override) metode `toMail`.

```php
// app/Notifications/CustomVerifyEmail.php

class CustomVerifyEmail extends VerifyEmail
{
    // Polimorfisme (Method Overriding): 
    // Kita menyediakan implementasi toMail kita sendiri, menggantikan logika induknya.
    public function toMail($notifiable)
    {
        // Logika kustom untuk mengirim template email tertentu
        return (new MailMessage)
            ->subject('✨ Verifikasi Email Anda - ' . config('app.name'))
            // ...
    }
}
```
**Penjelasan:** Sistem mengharapkan objek `Notification`. Dengan memberikan `CustomVerifyEmail`, sistem memanggil metode `toMail` *kita* yang spesifik, bukan yang default, menunjukkan polimorfisme melalui overriding.

### Contoh 2: `App\Http\Controllers\Admin\BaseContentController` (Abstract Class)
Ini adalah contoh klasik polimorfisme menggunakan kelas dasar abstrak. Kelas dasar mendefinisikan metode template (`store`, `update`) yang memanggil metode abstrak (`getModel`, `getValidationRules`) yang diimplementasikan secara berbeda oleh setiap kelas anak.

```php
// app/Http/Controllers/Admin/BaseContentController.php

abstract class BaseContentController extends Controller
{
    // Polimorfisme: Metode ini ada tetapi tidak memiliki implementasi di sini.
    // Kelas anak (EventController, NewsController) HARUS mengimplementasikannya.
    abstract protected function getModel();

    public function index(Request $request)
    {
        // Polimorfisme: Memanggil metode yang akan berperilaku berbeda 
        // tergantung pada instance kelas anak mana yang sedang berjalan.
        $model = $this->getModel(); 
        // ...
    }
}
```
**Penjelasan:** `BaseContentController` tidak tahu model *mana* yang digunakannya. Ia bergantung pada kelas anak (perilaku polimorfik) untuk menyediakan model yang benar melalui `getModel()`.

## 4. Abstraksi (Abstraction)
**Definisi:** Abstraksi adalah konsep menyembunyikan detail implementasi yang kompleks dan hanya menampilkan fitur-fitur yang diperlukan dari sebuah objek. Ini sering dicapai menggunakan Abstract Classes atau Interfaces.

### Contoh 1: `App\Models\Alumni` (Accessors)
Model `Alumni` mengabstraksi kompleksitas penghitungan "kelengkapan profil" di balik atribut sederhana.

```php
// app/Models/Alumni.php

// Abstraksi: Logika kompleks penghitungan poin disembunyikan di balik atribut ini.
public function getProfileCompletenessAttribute()
{
    $points = 0;
    // ... logika kompleks mengecek telepon, linkedin, bio, dll ...
    return round(($points / $total_criteria) * 100);
}
```
**Penjelasan:** Ketika Anda menggunakan `$alumni->profile_completeness`, Anda tidak perlu tahu *bagaimana* itu dihitung. Kompleksitasnya diabstraksi.

### Contoh 2: `Storage::disk('public')` (Facade/Interface)
Facade `Storage` Laravel mengabstraksi sistem file yang mendasarinya.

```php
// app/Services/ImageUploadService.php

// Abstraksi: Kita tidak peduli apakah 'public' adalah folder lokal, bucket S3, atau server FTP.
// Abstraksi 'Storage' menangani detailnya.
Storage::disk('public')->put($fullPath, (string) $encoded);
```
**Penjelasan:** Kode berinteraksi dengan API tingkat tinggi (`put`, `delete`). Detail implementasi (izin file, panggilan API ke AWS, dll.) sepenuhnya disembunyikan (diabstraksi) dari kode Anda.

## 5. Injeksi Ketergantungan (Dependency Injection - DI)
**Definisi:** DI adalah pola desain di mana ketergantungan sebuah kelas "disuntikkan" ke dalamnya (biasanya melalui konstruktor atau metode) daripada kelas tersebut membuatnya sendiri. Ini membuat kode lebih mudah diuji (testable) dan terpisah (decoupled).

### Contoh 1: `App\Http\Controllers\AuthController::login`
Objek `Request` disuntikkan ke dalam metode `login`.

```php
// app/Http/Controllers/AuthController.php

// Dependency Injection: Laravel menyuntikkan objek Request secara otomatis.
public function login(Request $request)
{
    $credentials = $request->validate([
        // ...
    ]);
    // ...
}
```
**Penjelasan:** Kita tidak menulis `new Request()`. Service Container Laravel secara otomatis menyediakan instance `Request` saat ini, memungkinkan kita mengakses data input dengan mudah.

### Contoh 2: `App\Http\Controllers\Admin\BaseContentController` (Constructor Injection)
`ImageUploadService` disuntikkan ke dalam konstruktor controller.

```php
// app/Http/Controllers/Admin/BaseContentController.php

class BaseContentController extends Controller
{
    protected $imageUploadService;

    // Dependency Injection: Kita meminta service yang kita butuhkan.
    // Laravel secara otomatis membuatnya dan memberikannya.
    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }
}
```
**Penjelasan:** Controller bergantung pada `ImageUploadService`. Alih-alih membuatnya di dalam controller (`new ImageUploadService`), kita memintanya di konstruktor. Ini memungkinkan kita untuk dengan mudah menukarnya (misalnya, untuk service tiruan/mock) selama pengujian.

## 6. Traits (Penggunaan Kembali Kode)
**Definisi:** Traits adalah mekanisme untuk penggunaan kembali kode dalam bahasa pewarisan tunggal seperti PHP. Mereka memungkinkan Anda menggunakan kembali kumpulan metode secara bebas di beberapa kelas independen.

### Contoh 1: `App\Models\User`
Model `User` menggunakan beberapa traits untuk mendapatkan fungsionalitas.

```php
// app/Models/User.php

class User extends Authenticatable
{
    // Traits: Mencampurkan fungsionalitas dari tempat lain
    use HasFactory, Notifiable;
    
    // ...
}
```
**Penjelasan:** `Notifiable` menambahkan metode seperti `notify()` ke model User tanpa memerlukan pewarisan. `HasFactory` menambahkan metode factory statis untuk pengujian.

### Contoh 2: `App\Models\News`
Model `News` juga menggunakan trait `HasFactory`.

```php
// app/Models/News.php

class News extends Model
{
    // Traits: Menggunakan kembali logika factory di model yang sama sekali berbeda
    use HasFactory;
}
```
**Penjelasan:** Meskipun `News` dan `User` adalah model yang berbeda, keduanya berbagi logika pembuatan factory yang sama persis yang disediakan oleh trait `HasFactory`.

## 7. Middleware (Penyaringan Request)
**Definisi:** Middleware menyediakan mekanisme yang nyaman untuk memeriksa dan memfilter permintaan HTTP yang masuk ke aplikasi Anda. Ia bertindak sebagai penjaga gerbang.

### Contoh 1: `App\Http\Middleware\IsAdmin`
Middleware ini memeriksa apakah pengguna adalah admin sebelum mengizinkan akses.

```php
// app/Http/Middleware/IsAdmin.php

public function handle(Request $request, Closure $next)
{
    if (auth()->user() && auth()->user()->role === 'admin') {
        return $next($request);
    }

    return redirect('/');
}
```
**Penjelasan:** Ini mengenkapsulasi logika "otorisasi". Controller tidak perlu memeriksa apakah pengguna adalah admin; middleware menanganinya secara global untuk rute tertentu.

### Contoh 2: `App\Http\Middleware\RedirectIfAuthenticated`
Middleware ini mencegah pengguna yang sudah login mengakses halaman login/register.

```php
// app/Http/Middleware/RedirectIfAuthenticated.php

public function handle(Request $request, Closure $next, string ...$guards): Response
{
    // ...
    if (Auth::guard($guard)->check()) {
        // Logika redirect jika sudah login
        return redirect()->route('alumni.root');
    }

    return $next($request);
}
```
**Penjelasan:** Ia mencegat permintaan ke halaman "khusus tamu" (seperti Login) dan mengarahkan pengguna jika mereka sudah terotentikasi, memastikan alur pengguna yang lancar.

## 8. Kelas Service (Pemisahan Tanggung Jawab)
**Definisi:** Kelas Service berisi logika bisnis yang tidak termasuk dalam Controller (yang seharusnya menangani HTTP) atau Model (yang seharusnya menangani Database). Ini menjaga kode tetap bersih dan terorganisir.

### Contoh 1: `App\Services\ImageUploadService`
Kelas ini menangani logika spesifik pemrosesan dan penyimpanan gambar.

```php
// app/Services/ImageUploadService.php

class ImageUploadService
{
    public function upload(UploadedFile $file, string $path, ...)
    {
        // Logika untuk resizing, konversi ke WebP, dan penyimpanan
        // ...
    }
}
```
**Penjelasan:** Controller tidak perlu tahu tentang "konversi WebP" atau "resizing". Ia hanya meminta Service untuk "mengupload" file. Ini mematuhi Prinsip Tanggung Jawab Tunggal (Single Responsibility Principle).

### Contoh 2: `App\Services\ActivityLogger`
Service ini menangani logika pencatatan aktivitas pengguna ke dalam database.

```php
// app/Services/ActivityLogger.php

class ActivityLogger
{
    public static function log($action, $description = null, $properties = [])
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            // ...
        ]);
    }
}
```
**Penjelasan:** Alih-alih menulis `ActivityLog::create(...)` di setiap controller, kita mendelegasikan tanggung jawab itu ke `ActivityLogger`. Jika kita ingin mengubah cara kita mencatat log (misalnya, menulis ke file alih-alih DB), kita hanya mengubah satu kelas service ini.

---

# Naskah Presentasi (Script)

**Pembukaan:**
"Halo semuanya, dalam proyek ini peran utama saya adalah menangani bagian **Frontend**, memastikan antarmuka pengguna responsif dan interaktif. Namun, saya juga berkontribusi pada beberapa logika backend yang krusial untuk mendukung fitur-fitur tersebut."

"Untuk bagian backend, saya ingin menyoroti 3 contoh penerapan prinsip OOP yang saya kerjakan atau pahami secara mendalam, yaitu Polimorfisme, Enkapsulasi, dan Service Classes."

---

### 1. Polimorfisme: BaseContentController
"Yang pertama dan yang paling menarik adalah penerapan **Polimorfisme** pada `BaseContentController`. Ini adalah fitur yang saya kerjakan untuk menyederhanakan pengelolaan konten seperti Berita (News) dan Acara (Event)."

*   **Cara Kerjanya:**
    "Kami memiliki sebuah kelas abstrak bernama `BaseContentController`. Kelas ini berisi semua logika dasar CRUD—seperti menyimpan data (`store`), mengupdate (`update`), dan menghapus (`destroy`). Namun, kelas ini tidak tahu *apa* yang sedang disimpannya."
    
    "Di sinilah letak polimorfismenya: Ketika request masuk untuk membuat 'Event', `EventController` (yang merupakan anak dari `BaseContentController`) akan berjalan. `BaseContentController` akan memanggil metode abstrak `getModel()`. Karena yang berjalan adalah `EventController`, maka ia akan menjawab: 'Saya menggunakan model Event'."
    
    "Jadi, satu kode controller induk bisa menangani berbagai jenis konten berbeda. Jika nanti kita ingin menambah fitur 'Lowongan Kerja', kita tinggal buat controller baru yang mewarisi ini, tanpa perlu menulis ulang logika penyimpanannya dari nol."

### 2. Enkapsulasi: Model User
"Contoh kedua adalah **Enkapsulasi** pada model `User`. Ini sangat penting untuk keamanan data."

*   **Cara Kerjanya:**
    "Di dalam file `User.php`, kami menggunakan properti `protected $fillable`. Ini bertindak sebagai 'satpam' yang membatasi data apa saja yang boleh diisi secara massal. Misalnya, jika ada hacker yang mencoba menyisipkan field `is_admin = true` saat register, sistem akan menolaknya karena `is_admin` tidak ada di dalam daftar `$fillable`."
    
    "Selain itu, kami juga menggunakan `protected $hidden` untuk field `password`. Ini memastikan bahwa ketika data user dikirim ke frontend (misalnya dalam bentuk JSON), password-nya tidak akan ikut terkirim, sehingga data sensitif tetap aman tersembunyi di dalam server."

### 3. Service Class: ImageUploadService
"Terakhir, saya ingin menjelaskan tentang **Service Class**, khususnya `ImageUploadService`. Ini berkaitan dengan prinsip pemisahan tanggung jawab (Separation of Concerns)."

*   **Cara Kerjanya:**
    "Saat user mengupload foto profil atau gambar berita, Controller tidak memproses gambarnya secara langsung. Controller hanya menerima file tersebut dan langsung menyerahkannya ke `ImageUploadService`."
    
    "Di dalam service inilah semua 'pekerjaan kotor' terjadi: mengubah nama file menjadi unik, mengubah formatnya menjadi WebP agar ringan, dan menyimpannya ke folder yang benar. Controller hanya menerima hasil akhirnya berupa path/alamat gambar tersebut."
    
    "Dengan cara ini, kode Controller kami tetap bersih dan mudah dibaca, dan jika kami ingin mengubah cara upload gambar (misalnya pindah ke Cloud Storage), kami cukup mengubah kode di Service ini saja tanpa mengganggu Controller."

**Penutup:**
"Itulah tiga contoh penerapan prinsip backend yang memastikan aplikasi kami tidak hanya berfungsi dengan baik, tetapi juga aman, rapi, dan mudah dikembangkan ke depannya."
