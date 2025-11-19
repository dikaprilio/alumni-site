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

// 1. Halaman Beranda Publik
Route::get('/', function () {
    if (Auth::check() && Auth::user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return Inertia::render('Welcome');
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
});

// 6. Logout
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});