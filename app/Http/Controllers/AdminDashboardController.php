<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
// use Illuminate\Support\Facades\Auth; // Opsional jika pakai $request->user()

class AlumniDashboardController extends Controller
{
    // Tambahkan Request $request di parameter
    public function index(Request $request)
    {
        // 1. Ambil user dari Request (lebih disarankan daripada Facade Auth)
        // Tambahkan komentar /** @var ... */ agar IDE tahu ini adalah Model User
        /** @var \App\Models\User $user */
        $user = $request->user();

        // 2. Load relasi (sekarang method load pasti dikenali)
        if ($user) {
            $user->load(['alumni.skills', 'alumni.jobHistories']);
        }
        
        // 3. Cek kelengkapan profil
        $completeness = 0;
        // Pastikan relasi alumni ada sebelum cek propertinya
        if ($user && $user->alumni) {
            if ($user->alumni->avatar) $completeness += 20;
            if ($user->alumni->graduation_year) $completeness += 20;
            if ($user->alumni->current_position) $completeness += 20;
            // Gunakan count() agar lebih efisien daripada load semua data
            if ($user->alumni->skills()->count() > 0) $completeness += 20;
            if ($user->alumni->jobHistories()->count() > 0) $completeness += 20;
        }

        return Inertia::render('Alumni/Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'completeness' => $completeness
        ]);
    }
    
    // Method update privacy toggle
    public function updatePrivacy(Request $request)
    {
        $alumni = $request->user()->alumni;
        
        $request->validate([
            'type' => 'required|in:email,phone',
            'value' => 'required|boolean'
        ]);

        if ($request->type === 'email') {
            $alumni->private_email = $request->value;
        } else {
            $alumni->private_phone = $request->value;
        }
        
        $alumni->save();

        return back();
    }
}