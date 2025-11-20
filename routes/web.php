<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
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


Route::get('/', function () {

    // Jika login sebagai admin → redirect ke dashboard admin
    if (Auth::check() && Auth::user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    // 1. Fetch Alumni Acak untuk Card
    $alumniList = Alumni::whereNotNull('avatar')
        ->inRandomOrder()
        ->limit(8)
        ->get(['id', 'name', 'current_job', 'company_name', 'avatar', 'graduation_year']);

    // 2. Statistik Pekerjaan (Top 5)
    $jobStats = Alumni::select('current_job', DB::raw('count(*) as total'))
        ->whereNotNull('current_job')
        ->where('current_job', '!=', '')
        ->groupBy('current_job')
        ->orderByDesc('total')
        ->limit(5)
        ->get();

    // 3. Total Alumni
    $totalAlumni = Alumni::count();
    // 1. Fetch News (Ambil 4 terbaru)
    $news = News::latest()
        ->limit(4)
        ->get(['id', 'title', 'image', 'created_at', 'category'])
        ->map(function ($item) {
            $item->type = 'NEWS'; // Label tipe
            $item->date = $item->created_at;
            return $item;
        });

    // 2. Fetch Events (Ambil 3 terbaru)
    // Asumsi tabel events punya kolom 'event_date'
    $events = Event::latest()
        ->limit(3)
        ->get(['id', 'title', 'image', 'event_date', 'category']) // Sesuaikan nama kolom tanggal event
        ->map(function ($item) {
            $item->type = 'EVENT'; // Label tipe
            $item->date = $item->event_date; // Standardisasi kolom tanggal
            return $item;
        });

    // 3. Merge & Sort
    // Gabung jadi satu koleksi, urutkan dari yang paling baru
    $latestUpdates = $news->concat($events)->sortByDesc('date')->take(6)->values();
    return Inertia::render('Welcome', [
        'canLogin'     => Route::has('login'),
        'canRegister'  => Route::has('register'),
        'alumniList'   => $alumniList,
        'jobStats'     => $jobStats,
        'totalAlumni'  => $totalAlumni,
        'alumniList' => $alumniList,
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
    Route::resource('/admin/alumni', AdminAlumniController::class)->names('admin.alumni');
    Route::get('/admin/alumni/export', [AdminAlumniController::class, 'export'])->name('admin.alumni.export');
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
    
    // Skills & Jobs Actions
    Route::post('/alumni/skills', [AlumniProfileController::class, 'addSkill'])->name('alumni.skills.add');
    Route::delete('/alumni/skills/{skill}', [AlumniProfileController::class, 'removeSkill'])->name('alumni.skills.remove');

    Route::post('/alumni/jobs', [AlumniProfileController::class, 'addJobHistory'])->name('alumni.jobs.add');
    Route::delete('/alumni/jobs/{id}', [AlumniProfileController::class, 'deleteJobHistory'])->name('alumni.jobs.delete');
    Route::post('/alumni/update-profile', [AlumniProfileController::class, 'updateProfile'])->name('alumni.update.profile');
    Route::post('/alumni/update-avatar', [AlumniProfileController::class, 'updateAvatar'])->name('alumni.update.avatar');
    Route::post('/alumni/settings/password', [AlumniProfileController::class, 'updatePassword'])->name('alumni.settings.password');
    Route::post('/alumni/settings/email', [AlumniProfileController::class, 'updateEmail'])->name('alumni.settings.email');
});
// 6. Logout
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});