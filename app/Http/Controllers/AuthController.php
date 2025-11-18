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
// --- TAMBAHKAN USE STATEMENTS INI ---
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
// -------------------------------------

class AuthController extends Controller
{
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

        // --- TAMBAHKAN BARIS INI ---
        // Paksa agar form ini HANYA bisa untuk role 'alumni'
        $credentials['role'] = 'alumni';

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            // $user = Auth::user(); // <-- Tidak perlu cek role lagi di sini

            // --- HAPUS BLOK IF INI ---
            // if ($user->role === 'admin') {
            //     // Admin salah login di form alumni, arahkan ke dashboard admin
            //     return redirect()->intended(route('admin.dashboard'));
            // }

            // Sukses login sebagai alumni
            return redirect()->intended(route('alumni.home'));
        }

        return back()->withErrors([
            // --- GANTI PESAN ERRORNYA ---
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
        $request->validate(['nim' => 'required|string']);

        $alumni = Alumni::where('nim', $request->nim)->first();

        if (!$alumni) {
            return back()->withErrors(['nim' => 'NIM tidak terdaftar. Hubungi admin.'])->onlyInput('nim');
        }

        if ($alumni->user_id !== null) {
            return back()->withErrors(['nim' => 'NIM ini sudah terhubung dengan akun lain.'])->onlyInput('nim');
        }

        // Simpan NIM yang valid di session dan lanjut ke step 2
        Session::flash('nim_untuk_register', $alumni->nim);
        Session::flash('nama_untuk_register', $alumni->user ? $alumni->user->name : 'Calon Alumni'); // Ambil nama jika ada, atau default
        
        // Ambil nama dari relasi user jika sudah ada, atau dari data alumni jika ada kolom nama
        // Untuk seeder, kita pakai nama dari user
        $alumniData = Alumni::with('user')->where('nim', $request->nim)->first();
        $nama = $alumni->name ?? 'Data Alumni'; // Ganti 'name' dengan kolom nama di tabel alumni jika ada

        Session::flash('nama_untuk_register', $nama);

        return redirect()->route('register.step2');
    }

    // =========================================
    // REGISTRASI ALUMNI (STEP 2: Buat Akun)
    // =========================================
    public function showRegisterStep2()
    {
        $nim = Session::get('nim_untuk_register');
        $nama = Session::get('nama_untuk_register');

        if (!$nim) {
            // Jika tidak ada NIM di session, tendang balik ke langkah 1
            return redirect()->route('register.step1');
        }

        return view('auth.register-step2', compact('nim', 'nama'));
    }

    public function register(Request $request)
    {
        $request->validate([
            'nim' => 'required|string|exists:alumnis,nim',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Cek ulang untuk keamanan
        $alumni = Alumni::where('nim', $request->nim)->first();
        if (!$alumni || $alumni->user_id !== null) {
            return redirect()->route('register.step1')->withErrors(['nim' => 'Terjadi kesalahan. Silakan ulangi.']);
        }

        // 1. Buat User baru
        $user = User::create([
            'name' => $alumni->name ?? $request->email, // Ambil nama dari data alumni jika ada
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'alumni', // Paksa role jadi alumni
        ]);

        // 2. Tautkan User baru ke data Alumni
        $alumni->user_id = $user->id;
        $alumni->save();

        // 3. Kirim email verifikasi
        $user->sendEmailVerificationNotification();

        // 4. Login-kan user
        Auth::login($user);

        // 5. Arahkan ke halaman home alumni
        return redirect()->route('alumni.home')->with('status', 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
    }


    // =========================================
    // PROSES VERIFIKASI EMAIL
    // =========================================

    public function showVerifyNotice()
    {
        // Tampilkan halaman "cek email Anda"
        return view('auth.verify-email');
    }

    public function verifyEmail(EmailVerificationRequest $request)
    {
        // Tandai email sebagai terverifikasi
        $request->fulfill();

        $user = $request->user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard')->with('status', 'Email berhasil diverifikasi!');
        }

        return redirect()->route('alumni.home')->with('status', 'Email berhasil diverifikasi!');
    }

    public function resendVerifyEmail(Request $request)
    {
        // Kirim ulang link
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('alumni.home');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'Link verifikasi baru telah dikirim ke email Anda.');
    }

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