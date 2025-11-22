<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\JobHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AlumniProfileController extends Controller
{
    // --- ROOT & SETUP ---

    /**
     * Smart Redirect: Checks if user needs setup or goes to dashboard.
     */
    public function root(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $alumni = $user->alumni;

        // If alumni record doesn't exist or critical info is missing, go to setup
        if (!$alumni || empty($alumni->phone_number) || empty($alumni->current_position)) {
            return redirect()->route('alumni.setup');
        }

        return redirect()->route('alumni.dashboard');
    }

    public function showSetup(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $alumni = $user->alumni;

        if ($alumni) {
            $alumni->load(['skills']);
        }

        return Inertia::render('Alumni/SetupWizard', [
            'alumni' => $alumni,
            'allSkills' => Skill::select('id', 'name', 'category')->orderBy('name')->get(),
        ]);
    }

    public function storeSetup(Request $request)
    {
        $alumni = $request->user()->alumni;
        $step = (int) $request->input('step');

        switch ($step) {
            case 1: // Contact & Privacy
                $validated = $request->validate([
                    'phone_number' => 'required|string|max:20',
                    'address'      => 'required|string|max:500',
                    'linkedin_url' => 'nullable|url',
                    'private_email'=> 'boolean',
                    'private_phone'=> 'boolean',
                ]);
                $alumni->update($validated);
                break;

            case 2: // Career
                $validated = $request->validate([
                    'current_position'  => 'required|string|max:100',
                    'company_name' => 'nullable|string|max:100', 
                ]);
                $alumni->update($validated);
                break;

            case 3: // Skills
                $request->validate([
                    'skills'   => 'array',
                    'skills.*' => 'exists:skills,id'
                ]);
                if ($request->has('skills')) {
                    $alumni->skills()->sync($request->skills);
                }
                return redirect()->route('alumni.dashboard')->with('message', 'Profil berhasil dilengkapi!');
            
            default:
                return back()->withErrors(['step' => 'Invalid step']);
        }

        return back()->with('message', 'Data step ' . $step . ' berhasil disimpan.');
    }

    // --- DASHBOARD (MY ACCOUNT) ---

    public function dashboard(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        // Load relations for dashboard view
        $user->load(['alumni.skills', 'alumni.jobHistories']);
        $alumni = $user->alumni;

        // Calculate completeness
        $completeness = $alumni ? $alumni->profile_completeness : 0;

        return Inertia::render('Alumni/Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'completeness' => $completeness,
            'badges' => $this->getBadges($completeness),
        ]);
    }

    // --- EDIT PROFILE ---

    public function edit(Request $request)
    {
        // UPDATE: Tambahkan 'jobHistories' dengan sorting terbaru
        $alumni = $request->user()->alumni()->with(['skills', 'jobHistories' => function($q) {
            $q->orderBy('start_date', 'desc');
        }])->first();
        
        $allSkills = Skill::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Alumni/Edit', [
            'alumni' => $alumni,
            'user_name' => $request->user()->name,
            'allSkills' => $allSkills
        ]);
    }

// FILE: app/Http/Controllers/AlumniProfileController.php

    public function update(Request $request)
    {
        $user = $request->user();
        $alumni = $user->alumni;

        $validated = $request->validate([
            'phone_number'      => 'required|string|max:20',
            'address'           => 'required|string|max:500',
            'bio'               => 'nullable|string|max:1000',
            'current_position'  => 'required|string|max:100',
            'company_name'      => 'nullable|string|max:100',
            'linkedin_url'      => 'nullable|url|max:255',
            'graduation_year'   => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'major'             => 'nullable|string|max:100',
            'skills'            => 'array',
            'skills.*'          => 'exists:skills,id',
            // Add validation for avatar
            'avatar'            => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        // Remove skills and avatar from the direct update array initially
        $alumniData = collect($validated)->except(['skills', 'avatar'])->toArray();

        // --- ADD THIS BLOCK TO HANDLE AVATAR UPLOAD ---
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($alumni->avatar) {
                Storage::disk('public')->delete($alumni->avatar);
            }
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $alumniData['avatar'] = $path;
        }
        // ----------------------------------------------

        $alumni->update($alumniData);

    // Sync skills
    if ($request->has('skills')) {
        $alumni->skills()->sync($request->skills);
    } else {
        $alumni->skills()->detach();
    }

    return back()->with('message', 'Profil berhasil diperbarui!');
}

    public function settings(Request $request)
    {
        return Inertia::render('Alumni/Settings', [
            'user' => $request->user(),
        ]);
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

        return back()->with('message', 'Password berhasil diubah.');
    }

    public function updateEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
        ]);

        $request->user()->update([
            'email' => $validated['email'],
            'email_verified_at' => null, // Reset verification
        ]);

        return back()->with('message', 'Email berhasil diperbarui. Silakan verifikasi ulang.');
    }

    // --- INDIVIDUAL ACTIONS (Legacy/Setup Support) ---

    public function addSkill(Request $request)
    {
        $request->validate(['skill_id' => 'required|exists:skills,id']);
        $request->user()->alumni->skills()->syncWithoutDetaching([$request->skill_id]);
        return back()->with('message', 'Skill added!');
    }

    public function removeSkill(Request $request, $skill)
    {
        $request->user()->alumni->skills()->detach($skill);
        return back()->with('message', 'Skill removed.');
    }

    // method addJobHistory()
    public function addJobHistory(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'position'     => 'required|string|max:255',
            
            // REVISI VALIDASI TANGGAL
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date', // Validasi logic
            
            'description'  => 'nullable|string|max:1000',
        ]);

        // Event 'created' di Model akan otomatis meng-update Alumni
        // jika end_date-nya kosong (masih bekerja)
        $request->user()->alumni->jobHistories()->create($validated);

        return back()->with('message', 'Work experience added!');
    }
    public function deleteJobHistory(Request $request, $id)
    {
        $job = $request->user()->alumni->jobHistories()->findOrFail($id);
        $job->delete();
        return back()->with('message', 'Work experience deleted.');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $alumni = $request->user()->alumni;

        if ($request->file('avatar')) {
            if ($alumni->avatar) {
                Storage::disk('public')->delete($alumni->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $alumni->update(['avatar' => $path]);
        }

        return back()->with('message', 'Foto profil berhasil diubah!');
    }

    // --- HELPERS ---

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