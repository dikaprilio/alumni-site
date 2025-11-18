<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash; // Import Hash
use Illuminate\Validation\Rule; // Import Rule

class AdminAlumniController extends Controller
{
    // Define the career field mapping and keywords for filtering
    private array $careerMapping = [
        'Web Development' => ['frontend', 'backend', 'fullstack', 'php', 'react', 'laravel', 'vue'],
        'Mobile Development' => ['android', 'ios', 'flutter', 'react native', 'kotlin', 'swift'],
        'Data & AI' => ['data analyst', 'data scientist', 'machine learning', 'big data', 'python'],
        'Infrastructure' => ['devops', 'cloud', 'sysadmin', 'docker'],
        'Quality & Testing' => ['qa', 'tester', 'sdet'],
        'Design & Creative' => ['ui/ux', 'product design', 'graphic design', 'multimedia'],
        'Management' => ['product manager', 'scrum master', 'project manager', 'tech lead'],
    ];

    /**
     * Display a listing of the resource with filters.
     */
    public function index(Request $request)
    {
        // Start Query with User relationship
        $query = Alumni::with('user');

        // 1. Search Filter (Enhanced & Case-Insensitive)
        if ($request->filled('search')) {
            $search = strtolower($request->search); 
            
            $query->where(function($q) use ($search) {
                // Search Alumni fields (Name, NIM, Job, Company)
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(nim) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(current_job) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(company_name) LIKE ?', ["%{$search}%"]);

                // Search User email
                $q->orWhereHas('user', function($subQ) use ($search) {
                    $subQ->whereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
                });
            });
        }
        
        // 2. Filter by Graduation Year (Angkatan)
        if ($request->filled('year') && $request->year != 'Semua') {
            $query->where('graduation_year', $request->year);
        }

        // 3. Filter by Status (Verified/Unverified)
        if ($request->filled('status') && $request->status != 'Semua') {
            if ($request->status == 'Terverifikasi') {
                $query->whereHas('user', function($q) {
                    $q->whereNotNull('email_verified_at');
                });
            } elseif ($request->status == 'Menunggu Verifikasi') {
                $query->whereHas('user', function($q) {
                    $q->whereNull('email_verified_at');
                });
            }
        }

        // 4. Filter by Location (Lokasi) - Searching in the 'address' column
        if ($request->filled('location') && $request->location != 'Semua') {
            $location = strtolower($request->location);
            $query->whereRaw('LOWER(address) LIKE ?', ["%{$location}%"]);
        }

        // 5. Filter by Career Field (Bidang Karir)
        if ($request->filled('career_field') && $request->career_field != 'Semua') {
            $careerField = $request->career_field;
            $keywords = $this->careerMapping[$careerField] ?? [];

            $query->where(function($q) use ($keywords) {
                foreach ($keywords as $keyword) {
                    // Use OR to match any keyword in current_job
                    $q->orWhereRaw('LOWER(current_job) LIKE ?', ["%{$keyword}%"]);
                }
            });
        }
        
        // Get results with pagination (10 per page)
        $alumnis = $query->latest()->paginate(10)->withQueryString();

        // Get distinct years for filter dropdown
        $years = Alumni::select('graduation_year')->distinct()->orderBy('graduation_year', 'desc')->pluck('graduation_year');
        
        // Cities for Location Filter (Common Indonesian cities based on assumptions)
        $commonLocations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Luar Negeri'];

        return view('admin.alumni.index', compact('alumnis', 'years', 'commonLocations'))
                ->with('careerFields', array_keys($this->careerMapping));
    }

    /**
     * Store a newly created alumni in storage (Create).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|max:20|unique:alumnis,nim',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:8',
            'graduation_year' => 'required|integer|digits:4|max:' . date('Y'),
            'major' => 'required|string|max:100', // Assuming major is part of Alumni model
            'phone_number' => 'nullable|string|max:15',
            'gender' => 'required|in:L,P',
            'address' => 'nullable|string|max:255',
        ]);

        $user = null;

        // 1. Create User account if email/password is provided
        if ($request->filled('email') && $request->filled('password')) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'alumni',
                'email_verified_at' => now(), // Assume manually added user is verified
            ]);
        }
        // 2. Create Alumni record (FIXED: Pass 'name' explicitly)
        Alumni::create([
            'user_id' => $user->id ?? null,
            'name' => $data['name'], // <-- THIS WAS MISSING
            'nim' => $data['nim'],
            'graduation_year' => $data['graduation_year'],
            'major' => $data['major'],
            'phone_number' => $data['phone_number'],
            'gender' => $data['gender'],
            'address' => $data['address'],
            // Karir fields can be updated later by the user or admin via edit
        ]);

        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni baru berhasil ditambahkan.');
    }

    /**
     * Update the specified alumni in storage (Update).
     */
    public function update(Request $request, $id)
    {
        $alumni = Alumni::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'nullable', 
                'email', 
                // Ignore current user's email if it exists
                Rule::unique('users', 'email')->ignore($alumni->user ? $alumni->user->id : null)
            ],
            'status' => 'required|in:Terverifikasi,Menunggu Verifikasi', // Used for verification status
            'graduation_year' => 'required|integer|digits:4',
            'current_job' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
        ]);
        
        // 1. Update Alumni details
        $alumni->update([
            'name' => $data['name'],
            'graduation_year' => $data['graduation_year'],
            'current_job' => $data['current_job'],
            'company_name' => $data['company_name'],
            // NIM cannot be changed via update for simplicity/integrity
        ]);

        // 2. Update User/Verification Status
        if ($alumni->user) {
             // Update User's name if they have an account
            $alumni->user->update(['name' => $data['name']]); 

            // Update Email Verification Status
            if ($data['status'] === 'Terverifikasi') {
                $alumni->user->email_verified_at = $alumni->user->email_verified_at ?? now();
            } else {
                $alumni->user->email_verified_at = null;
            }
             // Update email if provided
            if($request->filled('email')) {
                 $alumni->user->email = $data['email'];
            }

            $alumni->user->save();

        } elseif ($request->filled('email') && $data['status'] === 'Terverifikasi') {
            // Case: Alumni had no account, but admin provided email and set status to verified.
            // Create a new un-set user account. The user will need to use "Forgot Password" later.
            $newUser = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('changeme'), // Placeholder password
                'role' => 'alumni',
                'email_verified_at' => now(), 
            ]);
            $alumni->user_id = $newUser->id;
            $alumni->save();
        }


        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil diperbarui.');
    }

    /**
     * Export data to CSV. (Unchanged)
     */
    public function export()
    {
        // ... (Export logic remains the same) ...
        $filename = "alumni-data-" . date('Y-m-d') . ".csv";
        $alumnis = Alumni::with('user')->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($alumnis) {
            $file = fopen('php://output', 'w');
            
            // Header Row
            fputcsv($file, ['Nama', 'NIM', 'Angkatan', 'Email', 'No HP', 'Pekerjaan', 'Perusahaan', 'Status Verifikasi']);

            // Data Rows
            foreach ($alumnis as $alumni) {
                fputcsv($file, [
                    $alumni->name,
                    $alumni->nim,
                    $alumni->graduation_year,
                    $alumni->user->email ?? '-',
                    $alumni->phone_number,
                    $alumni->current_job ?? 'Belum bekerja',
                    $alumni->company_name ?? '-',
                    $alumni->user && $alumni->user->hasVerifiedEmail() ? 'Terverifikasi' : 'Pending'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Remove the specified resource from storage. (Unchanged)
     */
    public function destroy($id)
    {
        $alumni = Alumni::findOrFail($id);
        
        if ($alumni->user) {
            $alumni->user->delete();
        }
        
        $alumni->delete();

        return redirect()->back()->with('success', 'Data alumni berhasil dihapus.');
    }
}