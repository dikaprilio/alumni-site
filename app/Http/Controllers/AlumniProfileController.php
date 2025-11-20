<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\JobHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlumniProfileController extends Controller
{
    public function root()
    {
        $user = Auth::user();

        // --- FIX 1: Redirect Admin to Admin Dashboard ---
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        // ------------------------------------------------

        $alumni = $user->alumni;

        // Check if crucial data is missing
        if (!$alumni || empty($alumni->phone_number) || empty($alumni->current_job)) {
            return redirect()->route('alumni.setup');
        }

        return redirect()->route('alumni.dashboard');
    }

    public function showSetup()
    {
        $user = Auth::user();

        // --- FIX 1: Redirect Admin to Admin Dashboard ---
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        // ------------------------------------------------

        $alumni = $user->alumni;

        // --- FIX 2: Prevent Error on Null Alumni ---
        // Only load skills if alumni record exists
        if ($alumni) {
            $alumni->load(['skills']);
        }

        return Inertia::render('Alumni/SetupWizard', [
            'alumni' => $alumni,
            'allSkills' => Skill::select('id', 'name', 'category')->orderBy('name')->get(),
        ]);
    }
    /**
     * Simpan Data Setup (LOGIKA DIPERBAIKI)
     */
    public function storeSetup(Request $request)
    {
        $alumni = Auth::user()->alumni;
        
        // PENTING: Cast ke integer agar switch case terbaca benar
        $step = (int) $request->input('step');

        switch ($step) {
            case 1: // Step 1: Kontak & Privasi
                $validated = $request->validate([
                    'phone_number' => 'required|string|max:20',
                    'address'      => 'required|string|max:500',
                    'linkedin_url' => 'nullable|url',
                    'private_email'=> 'boolean',
                    'private_phone'=> 'boolean',
                ]);
                $alumni->update($validated);
                break;

            case 2: // Step 2: Karir
                $validated = $request->validate([
                    'current_job'  => 'required|string|max:100',
                    // company_name boleh null (opsional)
                    'company_name' => 'nullable|string|max:100', 
                ]);
                $alumni->update($validated);
                break;

            case 3: // Step 3: Skills
                $request->validate([
                    'skills'   => 'array',
                    'skills.*' => 'exists:skills,id'
                ]);
                
                // Update skills jika ada
                if ($request->has('skills')) {
                    $alumni->skills()->sync($request->skills);
                }
                return redirect()->route('alumni.dashboard')
                                ->with('message', 'Profil berhasil dilengkapi!');
            default:
                return back()->withErrors(['step' => 'Invalid step']);
        }

        return back()->with('message', 'Data step ' . $step . ' berhasil disimpan.');
    }

    /**
     * Dashboard Alumni
     */
    public function dashboard()
    {
        $alumni = Auth::user()->alumni->load(['skills', 'jobHistories']);
        $completeness = $alumni->profile_completeness;

        return Inertia::render('Alumni/Dashboard', [
            'alumni' => $alumni,
            'completeness' => $completeness,
            'badges' => $this->getBadges($completeness),
            
            // --- TAMBAHKAN BARIS INI ---
            // Kirim data skills ke Dashboard juga
            'allSkills' => \App\Models\Skill::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Tambah Skill (dari Dashboard)
     */
    public function addSkill(Request $request)
    {
        $request->validate(['skill_id' => 'required|exists:skills,id']);
        Auth::user()->alumni->skills()->syncWithoutDetaching([$request->skill_id]);
        return back()->with('message', 'Skill added!');
    }

    /**
     * Hapus Skill
     */
    public function removeSkill($skill)
    {
        Auth::user()->alumni->skills()->detach($skill);
        return back()->with('message', 'Skill removed.');
    }

    /**
     * Tambah Riwayat Kerja
     */
    public function addJobHistory(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'start_year' => 'required|digits:4|integer|min:1900|max:'.(date('Y')),
            'end_year' => 'nullable|digits:4|integer|min:1900|max:'.(date('Y') + 5).'|gte:start_year',
            'description' => 'nullable|string|max:1000',
        ]);

        Auth::user()->alumni->jobHistories()->create($validated);
        return back()->with('message', 'Work experience added!');
    }

    /**
     * Hapus Riwayat Kerja
     */
    public function deleteJobHistory($id)
    {
        $job = Auth::user()->alumni->jobHistories()->findOrFail($id);
        $job->delete();
        return back()->with('message', 'Work experience deleted.');
    }


    /**
     * Update Bio & General Info
     */
/**
     * Update Full Profile (Bio, Contact, Job Status)
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            // Bio & Social
            'bio' => 'nullable|string|max:1000',
            'linkedin_url' => 'nullable|url',
            
            // Contact
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'private_email' => 'boolean',
            'private_phone' => 'boolean',

            // Current Status
            'current_job' => 'required|string|max:100',
            'company_name' => 'nullable|string|max:100',
        ]);

        Auth::user()->alumni->update($validated);

        return back()->with('message', 'Profil berhasil diperbarui!');
    }

    /**
     * Upload Avatar
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        $alumni = Auth::user()->alumni;

        if ($request->file('avatar')) {
            // Hapus avatar lama jika ada (opsional, perlu logic tambahan hapus file)
            
            // Simpan avatar baru ke folder 'avatars' di disk public
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Update database
            $alumni->update(['avatar' => $path]);
        }

        return back()->with('message', 'Foto profil berhasil diubah!');
    }
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('message', 'Password berhasil diperbarui!');
    }

    /**
     * Ganti Email
     */
    public function updateEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
            'password_confirmation' => ['required', 'current_password'], // Konfirmasi password sebelum ganti email
        ]);

        $request->user()->update([
            'email' => $validated['email'],
            'email_verified_at' => null, // Reset verifikasi karena email berubah
        ]);
        
        // Opsional: Kirim ulang verifikasi email
        // $request->user()->sendEmailVerificationNotification();

        return back()->with('message', 'Email berhasil diperbarui! Mohon verifikasi ulang jika diperlukan.');
    }
    // --- Helpers ---

    private function getBadges($score)
    {
        $badges = [];
        if ($score >= 20) $badges[] = 'Newcomer';
        if ($score >= 50) $badges[] = 'Profile Starter';
        if ($score >= 80) $badges[] = 'Rising Star';
        if ($score === 100) $badges[] = 'Alumni Legend';
        return $badges;
    }
}