<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function index()
    {
        // Ambil semua user yang bukan alumni
        $admins = User::doesntHave('alumni')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'is_current_user' => $user->id === Auth::id(),
                ];
            });

        return Inertia::render('Admin/Settings', [
            'admins' => $admins,
        ]);
    }

    // Update Profile Sendiri
    public function updateProfile(Request $request)
    {
        // FIX: Fetch user via Model explicitly to access Eloquent methods like 'update'
        $user = User::findOrFail(Auth::id());

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    // Update Password Sendiri
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // FIX: Fetch user via Model explicitly
        $user = User::findOrFail(Auth::id());

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password berhasil diubah.');
    }

    // Buat Admin Baru
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Admin baru berhasil ditambahkan.');
    }

    // Hapus Admin
    public function destroyAdmin($id)
    {
        if ($id == Auth::id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user = User::findOrFail($id);
        
        // Safety check: Jangan hapus jika user entah bagaimana punya data alumni
        if ($user->alumni()->exists()) {
            return back()->with('error', 'User ini terhubung dengan data alumni. Hapus data alumninya terlebih dahulu.');
        }

        $user->delete();

        return back()->with('success', 'Admin berhasil dihapus.');
    }
}