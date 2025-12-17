<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Services\ActivityLogger; // Import Logger

class AuthController extends Controller
{
    // --- USER/ALUMNI LOGIN ---

    public function showLogin()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();

            // Cek Role
            if (Auth::user()->role === 'admin') {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Akun ini adalah akun Admin. Silakan login di halaman Admin.',
                ]);
            }

            ActivityLogger::log('LOGIN', 'User logged in via standard login.');

            return redirect()->intended(route('alumni.root'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    // --- ADMIN LOGIN ---

    public function showAdminLoginForm()
    {
        // Updated to use Inertia React Component
        return Inertia::render('Auth/AdminLogin', [
            'status' => session('status'),
        ]);
    }

    public function adminLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();

            // Security Check: Ensure user is actually an admin
            if (Auth::user()->role !== 'admin') {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Akses ditolak. Akun ini bukan akun Administrator.',
                ]);
            }

            ActivityLogger::log('ADMIN_LOGIN', 'Admin logged in.');

            // LOGIC UPDATE:
            // "intended" checks if the user was trying to access a specific page before being intercepted.
            // If yes -> redirects there.
            // If no (e.g. direct login) -> redirects to admin dashboard.
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Kredensial Admin tidak valid.',
        ])->onlyInput('email');
    }

    // --- LOGOUT ---

    public function logout(Request $request)
    {
        if (Auth::check()) {
            ActivityLogger::log('LOGOUT', 'User logged out.');
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    // --- REGISTER & VERIFICATION METHODS (UNCHANGED) ---
    
    public function showRegisterStep1()
    {
        return Inertia::render('Auth/RegisterStep1');
    }

    public function checkNim(Request $request)
    {
        $request->validate([
            'nim' => 'required|string|exists:alumnis,nim',
        ]);

        // Cek apakah NIM sudah punya User account
        $alumni = Alumni::where('nim', $request->nim)->first();

        if ($alumni->user_id) {
            return back()->withErrors(['nim' => 'NIM ini sudah terdaftar dan memiliki akun.']);
        }

        // Simpan NIM di session sementara untuk step 2
        session(['register_nim' => $alumni->nim]);
        session(['register_name' => $alumni->name]); 

        return redirect()->route('register.step2');
    }

    public function showRegisterStep2()
    {
        if (!session('register_nim')) {
            return redirect()->route('register.step1');
        }

        return Inertia::render('Auth/RegisterStep2', [
            'nim' => session('register_nim'),
            'name' => session('register_name')
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'nim' => 'required|exists:alumnis,nim', // Double check
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 1. Ambil Data Alumni
        $alumni = Alumni::where('nim', $request->nim)->firstOrFail();

        if ($alumni->user_id) {
            return back()->withErrors(['nim' => 'Akun sudah aktif.']);
        }

        // 2. Buat User
        $user = User::create([
            'name' => $alumni->name, 
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        
        // SECURITY: Role is explicitly set after creation (not mass-assigned)
        $user->role = 'alumni';
        $user->save();

        // 3. Link User ke Alumni
        $alumni->user_id = $user->id;
        $alumni->save();

        // 4. Trigger Event Registered (Kirim Email Verifikasi)
        event(new Registered($user));

        // 5. Login User
        Auth::login($user);

        ActivityLogger::log('REGISTER', 'User registered account.', ['nim' => $alumni->nim]);

        // 6. Bersihkan session
        $request->session()->forget(['register_nim', 'register_name']);

        // 7. Redirect ke verification notice
        return redirect()->route('verification.notice');
    }

    public function showVerifyNotice()
    {
        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('alumni.root');
        }

        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
            
            // Log account activation
            ActivityLogger::log(
                'ACCOUNT_ACTIVATED',
                "Alumni mengaktifkan akun melalui verifikasi email: {$user->email}",
                ['user_id' => $user->id, 'email' => $user->email]
            );
        }

        return redirect()->route('alumni.root')->with('verified', true);
    }

    public function resendVerifyEmail(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('message', 'Verification link sent!');
    }

    // --- PASSWORD RESET ---
    
    public function showForgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        // Laravel built-in generic password broker
        $status = \Illuminate\Support\Facades\Password::sendResetLink(
            $request->only('email')
        );

        if ($status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        return back()->withErrors(['email' => __($status)]);
    }

    public function showResetPassword(Request $request)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $request->route('token'),
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

        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        if ($status === \Illuminate\Support\Facades\Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', __($status));
        }

        return back()->withErrors(['email' => [__($status)]]);
    }
}