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