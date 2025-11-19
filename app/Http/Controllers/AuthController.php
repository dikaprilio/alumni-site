<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;
use App\Models\Alumni;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered; // Import Registered event

class AuthController extends Controller
{
    // ... (Login & Admin Login methods remain the same) ...
    // =========================================
    // LOGIN ALUMNI
    // =========================================
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Paksa agar form ini HANYA bisa untuk role 'alumni'
        $credentials['role'] = 'alumni';

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended(route('alumni.home'));
        }

        return back()->withErrors([
            'email' => 'Email atau password salah, atau akun Anda bukan akun alumni.',
        ])->onlyInput('email');
    }

    // =========================================
    // LOGIN ADMIN
    // =========================================
    public function showAdminLoginForm()
    {
        return view('auth.admin-login');
    }

    public function adminLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            // PENTING: Hanya izinkan ADMIN
            if ($user->role === 'admin') {
                return redirect()->intended(route('admin.dashboard'));
            }

            // Jika yang login alumni, tendang keluar lagi
            Auth::logout();
            return back()->withErrors([
                'email' => 'Akun ini bukan akun admin.',
            ])->onlyInput('email');
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    // =========================================
    // REGISTRASI ALUMNI (STEP 1: Cek NIM)
    // =========================================
    public function showRegisterStep1()
    {
        return view('auth.register-step1');
    }

    public function checkNim(Request $request)
    {
        $request->validate([
            'nim' => 'required|string',
        ]);

        // Cek apakah NIM ada di database alumni
        $alumni = Alumni::where('nim', $request->nim)->first();

        if (!$alumni) {
            // Kasus 1: NIM tidak ditemukan sama sekali
            return back()->withErrors(['nim' => 'NIM tidak ditemukan dalam database alumni.'])->withInput();
        }

        if ($alumni->user_id !== null) {
            // Kasus 2: NIM sudah punya akun user (sudah register sebelumnya)
            return back()->withErrors(['nim' => 'Akun untuk NIM ini sudah terdaftar. Silakan login.'])->withInput();
        }

        // Jika lolos semua, simpan data ke session untuk step selanjutnya
        Session::put('nim_untuk_register', $alumni->nim);
        Session::put('nama_untuk_register', $alumni->name);

        return redirect()->route('register.step2');
    }

    // =========================================
    // REGISTRASI ALUMNI (STEP 2: Buat Akun)
    // =========================================
    public function showRegisterStep2()
    {
        // Pastikan session masih ada, kalau tidak kembalikan ke step 1
        if (!Session::has('nim_untuk_register')) {
            return redirect()->route('register.step1');
        }

        $nim = Session::get('nim_untuk_register');
        $nama = Session::get('nama_untuk_register');

        return view('auth.register-step2', compact('nim', 'nama'));
    }

    public function register(Request $request)
    {
        // Validasi input dari form Step 2
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users', // Cek email unik di tabel users
            'password' => 'required|string|min:8|confirmed',
            // NIM diambil dari hidden input, pastikan konsisten dengan session (opsional tapi aman)
            'nim' => 'required|exists:alumnis,nim' 
        ], [
            'email.unique' => 'Alamat email ini sudah digunakan oleh akun lain.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 8 karakter.'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $nim = $request->nim;
        
        // Cek ulang (security layer)
        $alumni = Alumni::where('nim', $nim)->first();
        if (!$alumni || $alumni->user_id !== null) {
            return redirect()->route('register.step1')
                ->withErrors(['nim' => 'Terjadi kesalahan data atau akun sudah terdaftar.']);
        }

        // Buat User Baru
        $user = User::create([
            'name' => $alumni->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'alumni',
        ]);

        // Link User ke Alumni
        $alumni->update(['user_id' => $user->id]);

        // Trigger verifikasi email
        event(new Registered($user));

        // Login otomatis
        Auth::login($user);

        return redirect()->route('verification.notice');
    }



    // =========================================
    // PROSES VERIFIKASI EMAIL
    // =========================================

    /**
     * Tampilkan halaman pemberitahuan verifikasi email.
     */
    public function showVerifyNotice(Request $request)
    {
        // Jika user sudah terverifikasi, langsung ke home
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('alumni.home'));
        }

        return view('auth.verify-email');
    }

    /**
     * Proses verifikasi email ketika user klik link di email.
     */
    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();

        // Redirect sesuai role setelah verifikasi sukses
        if ($request->user()->role === 'admin') {
            return redirect()->route('admin.dashboard')->with('verified', true);
        }

        return redirect()->route('alumni.home')->with('verified', true);
    }

    /**
     * Kirim ulang email verifikasi.
     */
    public function resendVerifyEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('alumni.home'));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }

    // ... (Forgot Password & Reset Password & Logout methods remain the same) ...
    // =========================================
    // LUPA PASSWORD (BARU)
    // =========================================

    /**
     * Menampilkan form lupa password.
     */
    public function showLinkRequestForm()
    {
        return view('auth.forgot-password');
    }

    /**
     * Mengirim link reset password ke email alumni.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Cek dulu apakah email ini milik seorang alumni
        $user = User::where('email', $request->email)->where('role', 'alumni')->first();

        if (!$user) {
            return back()->withErrors(['email' => 'Kami tidak dapat menemukan alumni dengan alamat email tersebut.'])
                         ->onlyInput('email');
        }

        // Kirim link reset
        $status = Password::sendResetLink($request->only('email'));

        return $status == Password::RESET_LINK_SENT
                    ? back()->with('status', 'Link reset password telah dikirim ke email Anda!')
                    : back()->withErrors(['email' => 'Gagal mengirim link reset. Coba lagi nanti.'])->onlyInput('email');
    }

    /**
     * Menampilkan form untuk reset password baru.
     */
    public function showResetForm(Request $request, $token)
    {
        return view('auth.reset-password', [
            'token' => $token,
            'email' => $request->email
        ]);
    }

    /**
     * Memproses reset password baru.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Cek lagi apakah ini alumni
        $user = User::where('email', $request->email)->where('role', 'alumni')->first();
        if (!$user) {
            return back()->withErrors(['email' => 'Email alumni tidak ditemukan.']);
        }

        // Reset password
        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            // Otomatis login-kan alumni
            Auth::login($user);
            return redirect()->route('alumni.home')->with('status', 'Password Anda telah berhasil direset!');
        }

        // Jika token tidak valid atau error
        return back()->withErrors(['email' => 'Token reset password ini tidak valid atau sudah kedaluwarsa.'])
                     ->withInput($request->only('email'));
    }


    // =========================================
    // LOGOUT
    // =========================================
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/'); // Arahkan ke Halaman Beranda Publik
    }
}