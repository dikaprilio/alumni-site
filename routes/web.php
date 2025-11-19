<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAlumniController;
use App\Http\Controllers\AdminNewsController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\AdminJobController; 

// 1. Halaman Beranda Publik
Route::get('/', function () {
    if (Auth::check()) {
        if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('alumni.home');
    }
    return view('pages.public.home');
})->name('home');

// 2. Guest Routes (Login & Register)
Route::middleware('guest')->group(function () {
    // Login Alumni
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('login.process');

    // Login Admin
    Route::get('/admin/login', [AuthController::class, 'showAdminLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin'])
        ->middleware('throttle:5,1')
        ->name('admin.login.process');
    
    // Register
    Route::get('/register', [AuthController::class, 'showRegisterStep1'])->name('register.step1');
    Route::post('/register/check-nim', [AuthController::class, 'checkNim'])
        ->middleware('throttle:10,1')
        ->name('register.checkNim');
        
    Route::get('/register/create', [AuthController::class, 'showRegisterStep2'])->name('register.step2');
    Route::post('/register', [AuthController::class, 'register'])->name('register.process');

    // Password Reset
    Route::get('/forgot-password', [AuthController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
});

// 3. Verification Routes (Requires Auth)
Route::middleware(['auth'])->group(function () {
    // Halaman Notice "Please Verify Email"
    Route::get('/email/verify', [AuthController::class, 'showVerifyNotice'])
        ->name('verification.notice');

    // Link di Email yang diklik User
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Tombol "Resend Verification Email"
    Route::post('/email/verification-notification', [AuthController::class, 'resendVerifyEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// 4. ADMIN ROUTES (Requires Auth, Admin Role, Verified Email)
Route::middleware(['auth', 'admin', 'verified'])->group(function () {
    
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // --- MANAJEMEN ALUMNI ---
    Route::get('/admin/alumni', [AdminAlumniController::class, 'index'])->name('admin.alumni.index');
    Route::get('/admin/alumni/export', [AdminAlumniController::class, 'export'])->name('admin.alumni.export');
    Route::post('/admin/alumni', [AdminAlumniController::class, 'store'])->name('admin.alumni.store');
    Route::put('/admin/alumni/{id}', [AdminAlumniController::class, 'update'])->name('admin.alumni.update');
    Route::delete('/admin/alumni/{id}', [AdminAlumniController::class, 'destroy'])->name('admin.alumni.destroy');

    // --- MANAJEMEN BERITA ---
    Route::get('/admin/news', [AdminNewsController::class, 'index'])->name('admin.news.index');
    Route::post('/admin/news', [AdminNewsController::class, 'store'])->name('admin.news.store');
    Route::put('/admin/news/{id}', [AdminNewsController::class, 'update'])->name('admin.news.update');
    Route::delete('/admin/news/{id}', [AdminNewsController::class, 'destroy'])->name('admin.news.destroy');

    // --- MANAJEMEN EVENT ---
    Route::get('/admin/events', [AdminEventController::class, 'index'])->name('admin.events.index');
    Route::post('/admin/events', [AdminEventController::class, 'store'])->name('admin.events.store');
    Route::put('/admin/events/{id}', [AdminEventController::class, 'update'])->name('admin.events.update');
    Route::delete('/admin/events/{id}', [AdminEventController::class, 'destroy'])->name('admin.events.destroy');

    // --- MANAJEMEN LOWONGAN KERJA ---
    Route::get('/admin/jobs', [AdminJobController::class, 'index'])->name('admin.jobs.index');
    Route::post('/admin/jobs', [AdminJobController::class, 'store'])->name('admin.jobs.store');
    Route::put('/admin/jobs/{id}', [AdminJobController::class, 'update'])->name('admin.jobs.update');
    Route::delete('/admin/jobs/{id}', [AdminJobController::class, 'destroy'])->name('admin.jobs.destroy');

});

// 5. Alumni Routes (Requires Auth, Verified Email)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/alumni/home', function() {
        return view('pages.user.home');
    })->name('alumni.home');
});

// 6. Logout (Requires Auth)
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});