<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 1. Halaman Beranda Publik (Bisa diakses semua)
Route::get('/', function () {
    return view('pages.public.home');
})->name('home');


// 2. Group Route untuk Tamu (yang belum login)
Route::middleware('guest')->group(function () {
    // Rute Login Alumni
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.process');

    // Rute Login Admin
    Route::get('/admin/login', [AuthController::class, 'showAdminLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('admin.login.process');

    // Rute Registrasi Alumni (Langkah 1: Cek NIM)
    Route::get('/register', [AuthController::class, 'showRegisterStep1'])->name('register.step1');
    Route::post('/register/check-nim', [AuthController::class, 'checkNim'])->name('register.checkNim');

    // Rute Registrasi Alumni (Langkah 2: Buat Akun)
    Route::get('/register/create', [AuthController::class, 'showRegisterStep2'])->name('register.step2');
    Route::post('/register', [AuthController::class, 'register'])->name('register.process');

    // --- TAMBAHKAN ROUTE LUPA PASSWORD INI ---
    Route::get('/forgot-password', [AuthController::class, 'showLinkRequestForm'])
         ->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])
         ->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])
         ->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
         ->name('password.update');
    // -----------------------------------------
});


// 3. Group Route untuk Email Verifikasi (Wajib login, tapi belum terverifikasi)
Route::middleware(['auth'])->group(function () {
    Route::get('/email/verify', [AuthController::class, 'showVerifyNotice'])
        ->name('verification.notice');
    
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify');
    
    Route::post('/email/verification-notification', [AuthController::class, 'resendVerifyEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});


// 4. Group Route KHUSUS ADMIN (Wajib login, wajib role admin, wajib email terverifikasi)
Route::middleware(['auth', 'admin', 'verified'])->group(function () {
    Route::get('/admin/dashboard', function() {
        return view('admin.dashboard');
    })->name('admin.dashboard');
    // ... rute admin lainnya
});


// 5. Group Route untuk ALUMNI (Wajib login, wajib email terverifikasi)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/alumni/home', function() {
        return view('pages.user.home');
    })->name('alumni.home');
    // ... rute alumni lainnya
});


// 6. Rute Logout (Bisa diakses semua yang sudah login)
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});