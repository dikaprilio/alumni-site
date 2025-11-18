<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route untuk Halaman Depan (Sementara redirect ke login dulu)
Route::get('/', function () {
    return redirect('/login');
});

// Group Route untuk Tamu (yang belum login)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.process');
});

// Group Route KHUSUS ADMIN
// Sebelum masuk, user harus lolos 'auth' (login) DAN 'admin' (role check)
Route::middleware(['auth', 'admin'])->group(function () {
    
    Route::get('/admin/dashboard', function() {
        return view('admin.dashboard');
    })->name('admin.dashboard');

    // Nanti route lain kayak hapus alumni, edit berita, taruh sini semua
});

// Group Route untuk Alumni (Cukup 'auth' saja)
Route::middleware(['auth'])->group(function () {
    Route::get('/home', function() {
        return view('pages.user.home'); // Atau halaman alumni lain
    })->name('user.home');
});