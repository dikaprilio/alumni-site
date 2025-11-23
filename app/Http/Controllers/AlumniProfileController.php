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
use App\Services\ActivityLogger; // Import Logger

class AlumniProfileController extends Controller
{
    // --- ROOT & SETUP ---

    public function root(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $alumni = $user->alumni;

        // Cek kelengkapan menggunakan relasi job history, bukan kolom tabel
        // Kita cek apakah ada minimal 1 job history
        $hasJob = $alumni && $alumni->jobHistories()->exists();
        
        if (!$alumni || empty($alumni->phone_number) || !$hasJob) {
            return redirect()->route('alumni.setup');
        }

        return redirect()->route('alumni.dashboard');
    }

    public function showSetup(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') return redirect()->route('admin.dashboard');

        $alumni = $user->alumni;
        if ($alumni) $alumni->load(['skills']);

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
            case 1: // Contact
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
                // PERBAIKAN: Data ini sekarang masuk ke tabel JobHistory
                $validated = $request->validate([
                    'current_position' => 'required|string|max:100',
                    'company_name'     => 'required|string|max:100', 
                ]);

                // Buat Riwayat Pekerjaan Baru (Otomatis start_date hari ini karena setup wizard sederhana)
                $alumni->jobHistories()->create([
                    'position'     => $validated['current_position'],
                    'company_name' => $validated['company_name'],
                    'start_date'   => now(), // Default start date
                    'end_date'     => null,  // Null berarti "Currently working here"
                ]);
                break;

            case 3: // Skills
                $request->validate(['skills' => 'array', 'skills.*' => 'exists:skills,id']);
                if ($request->has('skills')) {
                    $alumni->skills()->sync($request->skills);
                }
                return redirect()->route('alumni.dashboard')->with('message', 'Profil berhasil dilengkapi!');
            
            default:
                return back()->withErrors(['step' => 'Invalid step']);
        }

        return back()->with('message', 'Data step ' . $step . ' berhasil disimpan.');
    }

    // --- DASHBOARD ---

    public function dashboard(Request $request)
    {
        $user = $request->user();
        // Load jobHistories agar perhitungan completeness di model valid
        $user->load(['alumni.skills', 'alumni.jobHistories']);
        $alumni = $user->alumni;

        $completeness = $alumni ? $alumni->profile_completeness : 0;

        return Inertia::render('Alumni/Dashboard', [
            'auth' => ['user' => $user],
            'completeness' => $completeness,
            'badges' => $this->getBadges($completeness),
        ]);
    }

    // --- EDIT PROFILE ---

    public function edit(Request $request)
    {
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

    public function update(Request $request)
    {
        $user = $request->user();
        $alumni = $user->alumni;

        // PERBAIKAN: Hapus current_position & company_name dari validasi Update Profil Utama
        // User harus mengedit pekerjaan lewat fitur Job History
        $validated = $request->validate([
            'phone_number'      => 'required|string|max:20',
            'address'           => 'required|string|max:500',
            'bio'               => 'nullable|string|max:1000',
            'linkedin_url'      => 'nullable|url|max:255',
            'graduation_year'   => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'major'             => 'nullable|string|max:100',
            'avatar'            => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // KEMBALI: validasi skills wajib ada agar sync aman
            'skills'            => 'array',
            'skills.*'          => 'exists:skills,id',
        ]);

        if ($request->hasFile('avatar')) {
            if ($alumni->avatar) Storage::disk('public')->delete($alumni->avatar);
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        // Update alumni hanya dengan data yang valid
        $alumni->update(collect($validated)->except(['skills'])->toArray());

        // Sync skills; jika request tidak mengirim 'skills' kita detach (supaya bisa hapus semua)
        if ($request->has('skills')) {
            $alumni->skills()->sync($request->input('skills'));
        } else {
            $alumni->skills()->detach();
        }

        ActivityLogger::log('UPDATE_PROFILE', 'User updated their profile.');

        return back()->with('message', 'Profil berhasil diperbarui!');
    }

    // --- INDIVIDUAL ACTIONS (Legacy/Setup Support) ---

    // Tetap sediakan addSkill/removeSkill untuk kompatibilitas frontend lama
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
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
            'description'  => 'nullable|string|max:1000',
        ]);

        $request->user()->alumni->jobHistories()->create($validated);

        ActivityLogger::log('ADD_JOB', 'User added a job history.', ['company' => $validated['company_name']]);

        return back()->with('message', 'Work experience added!');
    }

    public function deleteJobHistory(Request $request, $id)
    {
        $request->user()->alumni->jobHistories()->findOrFail($id)->delete();
        
        ActivityLogger::log('DELETE_JOB', 'User deleted a job history.', ['job_id' => $id]);

        return back()->with('message', 'Work experience deleted.');
    }

    // --- Avatar specific endpoint (kompatibilitas) ---
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

    public function settings(Request $request)
    {
        // Kembalikan user juga supaya view punya context (kompatibilitas)
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
        $request->user()->update(['password' => Hash::make($validated['password'])]);

        ActivityLogger::log('UPDATE_PASSWORD', 'User changed their password.');

        return back()->with('message', 'Password berhasil diubah.');
    }

    public function updateEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
        ]);
        $request->user()->update(['email' => $validated['email'], 'email_verified_at' => null]);

        ActivityLogger::log('UPDATE_EMAIL', 'User changed their email address.');

        return back()->with('message', 'Email berhasil diperbarui. Silakan verifikasi ulang.');
    }
    
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
