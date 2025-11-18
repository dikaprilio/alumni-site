<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // 1. Tampilkan Form Login
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // 2. Proses Login (Cek Email & Password)
    public function login(Request $request)
    {
        // Validasi input dulu
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Coba login
        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            // Cek Role & Arahkan ke Dashboard yang sesuai
            $user = Auth::user();
            
            if ($user->role === 'admin') {
                return redirect()->intended('/admin/dashboard');
            }

            return redirect()->intended('/home');
        }

        // Kalau gagal
        return back()->withErrors([
            'email' => 'Email atau password salah bro.',
        ]);
    }

    // 3. Logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}