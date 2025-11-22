<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PublicAlumniController;
use App\Http\Controllers\PublicNewsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAlumniController;
use App\Http\Controllers\AdminNewsController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\AdminJobController;
use App\Http\Controllers\AlumniProfileController;
use App\Models\Alumni;
use App\Models\News;
use App\Models\Event;
use Illuminate\Support\Facades\DB;


// PUBLIC WARTA ROUTES
Route::get('/news', [PublicNewsController::class, 'index'])->name('public.news');
Route::get('/news/{id}', [PublicNewsController::class, 'showNews'])->name('public.news.show');
Route::get('/events/{id}', [PublicNewsController::class, 'showEvent'])->name('public.events.show');
Route::get('/directory', [PublicAlumniController::class, 'index'])->name('public.alumni');
Route::get('/directory/{id}', [PublicAlumniController::class, 'show'])->name('public.alumni.show');
Route::get('/', function () {

    // REVISI: Admin tidak lagi dipaksa redirect ke dashboard jika mengunjungi landing page.
    // Mereka bisa melihat halaman depan seperti user biasa.
    // Login redirect logic ditangani di AuthController@adminLogin.

    // 1. Fetch Alumni Acak untuk Card
    $alumniList = Alumni::with('skills')
        ->whereNotNull('avatar')
        ->inRandomOrder()
        ->limit(8)
        ->get(['id', 'name', 'current_position', 'company_name', 'avatar', 'graduation_year']);

    // 2. Statistik Pekerjaan (Top 5)
    $jobStats = Alumni::select('current_position', DB::raw('count(*) as total'))
        ->whereNotNull('current_position')
        ->where('current_position', '!=', '')
        ->groupBy('current_position')
        ->orderByDesc('total')
        ->limit(5)
        ->get();

    // 3. Total Alumni
    $totalAlumni = Alumni::count();
    
    // 4. Fetch News (Ambil 4 terbaru)
    $news = News::latest()
        ->limit(4)
        ->get(['id', 'title', 'image', 'created_at', 'category'])
        ->map(function ($item) {
            $item->type = 'NEWS'; // Label tipe
            $item->date = $item->created_at;
            return $item;
        });

    // 5. Fetch Events (Ambil 3 terbaru)
    $events = Event::latest()
        ->limit(3)
        ->get(['id', 'title', 'image', 'event_date', 'category'])
        ->map(function ($item) {
            $item->type = 'EVENT'; // Label tipe
            $item->date = $item->event_date; 
            return $item;
        });

    // 6. Merge & Sort
    $latestUpdates = $news->concat($events)->sortByDesc('date')->take(6)->values();
    
    return Inertia::render('Welcome', [
        'canLogin'     => Route::has('login'),
        'canRegister'  => Route::has('register'),
        'alumniList'   => $alumniList,
        'jobStats'     => $jobStats,
        'totalAlumni'  => $totalAlumni,
        'latestUpdates' => $latestUpdates,
    ]);

})->name('home');


// 2. Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login'); 
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('login.process');
    Route::get('/admin/login', [AuthController::class, 'showAdminLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1')->name('admin.login.process');
    
    Route::get('/register', [AuthController::class, 'showRegisterStep1'])->name('register.step1');
    Route::post('/register/check-nim', [AuthController::class, 'checkNim'])->middleware('throttle:10,1')->name('register.checkNim');
    Route::get('/register/create', [AuthController::class, 'showRegisterStep2'])->name('register.step2');
    Route::post('/register', [AuthController::class, 'register'])->name('register.process');

    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
});

// 3. Verification Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/email/verify', [AuthController::class, 'showVerifyNotice'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
    Route::post('/email/verification-notification', [AuthController::class, 'resendVerifyEmail'])
        ->middleware('throttle:6,1')->name('verification.send');
});

// 4. ADMIN ROUTES
    Route::middleware(['auth', 'admin', 'verified'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // --- PINDAHKAN INI KE ATAS ---
    // Route spesifik harus didefinisikan SEBELUM Route::resource agar tidak tertimpa
    Route::get('/admin/alumni/export', [AdminAlumniController::class, 'export'])->name('admin.alumni.export');
    
    // Baru kemudian Resource Route
    Route::resource('/admin/alumni', AdminAlumniController::class)->names('admin.alumni');
    
    Route::resource('/admin/news', AdminNewsController::class)->names('admin.news');
    Route::resource('/admin/events', AdminEventController::class)->names('admin.events');
    Route::resource('/admin/jobs', AdminJobController::class)->names('admin.jobs');
});

// 5. ALUMNI ROUTES (PROFILE & DASHBOARD)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // "Smart Root" -> Directs to Setup or Dashboard
    Route::get('/alumni', [AlumniProfileController::class, 'root'])->name('alumni.root');

    // Onboarding Wizard
    Route::get('/alumni/setup', [AlumniProfileController::class, 'showSetup'])->name('alumni.setup');
    Route::post('/alumni/setup', [AlumniProfileController::class, 'storeSetup'])->name('alumni.setup.store');

    // Main Dashboard
    Route::get('/alumni/dashboard', [AlumniProfileController::class, 'dashboard'])->name('alumni.dashboard');
    
    // EDIT PROFIL
    Route::get('/alumni/edit', [AlumniProfileController::class, 'edit'])->name('alumni.edit');
    Route::post('/alumni/edit', [AlumniProfileController::class, 'update'])->name('alumni.update');

    // SECURITY SETTINGS
    Route::get('/alumni/settings', [AlumniProfileController::class, 'settings'])->name('alumni.settings');
    Route::post('/alumni/settings/password', [AlumniProfileController::class, 'updatePassword'])->name('alumni.update.password');
    Route::post('/alumni/settings/email', [AlumniProfileController::class, 'updateEmail'])->name('alumni.update.email');
    Route::post('/alumni/jobs', [App\Http\Controllers\AlumniProfileController::class, 'addJobHistory'])->name('alumni.jobs.add');
    Route::delete('/alumni/jobs/{id}', [App\Http\Controllers\AlumniProfileController::class, 'deleteJobHistory'])->name('alumni.jobs.delete');
});

// 6. Logout
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});