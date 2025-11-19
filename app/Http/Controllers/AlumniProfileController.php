<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\JobHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlumniProfileController extends Controller
{
    /**
     * "Smart Root": Determines if Alumni needs Setup or goes to Dashboard.
     */
    public function root()
    {
        $alumni = Auth::user()->alumni;

        // Logic: If Phone or Current Job is missing, force them to Setup Wizard
        if (empty($alumni->phone_number) || empty($alumni->current_job)) {
            return redirect()->route('alumni.setup');
        }

        return redirect()->route('alumni.dashboard');
    }

    /**
     * Show the Onboarding Wizard (Step-by-step form).
     */
    public function showSetup()
    {
        return Inertia::render('Alumni/SetupWizard', [
            'alumni' => Auth::user()->alumni->load(['skills']),
            'allSkills' => Skill::select('id', 'name', 'category')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store data from Setup Wizard (and Edit Profile).
     */
    public function storeSetup(Request $request)
    {
        $alumni = Auth::user()->alumni;
        $step = $request->input('step');

        // --- STEP 1: Personal & Privacy ---
        if ($step === 1) {
            $validated = $request->validate([
                'phone_number' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'linkedin_url' => 'nullable|url',
                'private_email' => 'boolean',
                'private_phone' => 'boolean',
            ]);
            $alumni->update($validated);
        }
        
        // --- STEP 2: Current Job Status ---
        elseif ($step === 2) {
            $validated = $request->validate([
                'current_job' => 'required|string|max:100',
                'company_name' => 'nullable|string|max:100',
            ]);
            $alumni->update($validated);
        }
        
        // --- STEP 3: Skills ---
        elseif ($step === 3) {
            $request->validate([
                'skills' => 'array',
                'skills.*' => 'exists:skills,id'
            ]);
            
            if ($request->has('skills')) {
                $alumni->skills()->sync($request->skills);
            }
        }

        return back()->with('message', 'Data saved successfully.');
    }

    /**
     * Main Alumni Dashboard.
     */
    public function dashboard()
    {
        $alumni = Auth::user()->alumni->load(['skills', 'jobHistories']);
        $completeness = $alumni->profile_completeness;

        return Inertia::render('Alumni/Dashboard', [
            'alumni' => $alumni,
            'completeness' => $completeness,
            'badges' => $this->getBadges($completeness),
        ]);
    }

    /**
     * Add a single Skill (from Dashboard).
     */
    public function addSkill(Request $request)
    {
        $request->validate(['skill_id' => 'required|exists:skills,id']);
        
        Auth::user()->alumni->skills()->syncWithoutDetaching([$request->skill_id]);

        return back()->with('message', 'Skill added!');
    }

    /**
     * Remove a Skill.
     */
    public function removeSkill($skill)
    {
        Auth::user()->alumni->skills()->detach($skill);
        return back()->with('message', 'Skill removed.');
    }

    /**
     * Add Job History.
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
     * Delete Job History.
     */
    public function deleteJobHistory($id)
    {
        $job = Auth::user()->alumni->jobHistories()->findOrFail($id);
        $job->delete();

        return back()->with('message', 'Work experience deleted.');
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