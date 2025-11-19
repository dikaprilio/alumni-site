<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    // =========================================
    // LOGIN ALUMNI
    // =========================================
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password, 'role' => 'alumni'], $request->boolean('remember'))) {
            $request->session()->regenerate();
            // Redirect to intended or the smart alumni root
            return redirect()->intended(route('alumni.root'));
        }

        return back()->withErrors([
            'email' => 'Email/Password salah atau akun bukan Alumni.',
        ]);
    }

    // =========================================
    // PROSES VERIFIKASI EMAIL
    // =========================================
    public function showVerifyNotice(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('alumni.root');
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
        ]);
    }

    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();

        if ($request->user()->role === 'admin') {
            return redirect()->route('admin.dashboard')->with('verified', true);
        }

        // CRITICAL FIX: Redirect to 'alumni.root' so the Setup Wizard logic runs
        return redirect()->route('alumni.root')->with('verified', true);
    }

    public function resendVerifyEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('alumni.root');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }

    // =========================================
    // REGISTRASI STEP 1: CEK NIM
    // =========================================
    public function showRegisterStep1()
    {
        return Inertia::render('Auth/RegisterStep1');
    }

    public function checkNim(Request $request)
    {
        $request->validate([
            'nim' => 'required|string',
        ]);

        $alumni = Alumni::where('nim', $request->nim)->first();

        if (!$alumni) {
            return back()->withErrors(['nim' => 'NIM tidak ditemukan dalam database alumni kami.']);
        }

        if ($alumni->user_id !== null) {
            return back()->withErrors(['nim' => 'Akun untuk NIM ini sudah terdaftar. Silakan login.']);
        }

        Session::put('nim_untuk_register', $alumni->nim);
        Session::put('nama_untuk_register', $alumni->name);

        return redirect()->route('register.step2');
    }

    // =========================================
    // REGISTRASI STEP 2: BUAT AKUN
    // =========================================
    public function showRegisterStep2()
    {
        if (!Session::has('nim_untuk_register')) {
            return redirect()->route('register.step1');
        }

        return Inertia::render('Auth/RegisterStep2', [
            'nim' => Session::get('nim_untuk_register'),
            'nama' => Session::get('nama_untuk_register'),
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'nim' => 'required|exists:alumnis,nim' 
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $alumni = Alumni::where('nim', $request->nim)->first();
        if (!$alumni || $alumni->user_id !== null) {
            return redirect()->route('register.step1')
                ->withErrors(['nim' => 'Terjadi kesalahan data atau akun sudah terdaftar.']);
        }

        $user = User::create([
            'name' => $alumni->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'alumni',
        ]);

        $alumni->update(['user_id' => $user->id]);

        event(new Registered($user));
        Auth::login($user);

        Session::forget(['nim_untuk_register', 'nama_untuk_register']);

        // Redirect to verification notice
        return redirect()->route('verification.notice');
    }

    // =========================================
    // LOGOUT
    // =========================================
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    // =========================================
    // PASSWORD RESET
    // =========================================
    public function showForgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->where('role', 'alumni')->first();

        if (!$user) {
            return back()->withErrors(['email' => 'Email alumni tidak ditemukan.']);
        }

        $status = Password::sendResetLink($request->only('email'));

        return $status == Password::RESET_LINK_SENT
                    ? back()->with('status', 'Link reset password telah dikirim!')
                    : back()->withErrors(['email' => 'Gagal mengirim link.']);
    }

    public function showResetPassword(Request $request, $token = null)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();
                event(new PasswordReset($user));
            }
        );

        return $status == Password::PASSWORD_RESET
                    ? redirect()->route('login')->with('status', 'Password berhasil direset!')
                    : back()->withErrors(['email' => 'Token invalid atau email salah.']);
    }
    
    // =========================================
    // ADMIN LOGIN
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

            if ($user->role === 'admin') {
                return redirect()->intended(route('admin.dashboard'));
            }

            Auth::logout();
            return back()->withErrors(['email' => 'Akun ini bukan akun admin.']);
        }

        return back()->withErrors(['email' => 'Email atau password salah.']);
    }
}