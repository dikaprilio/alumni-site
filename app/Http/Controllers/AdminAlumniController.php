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
                  ->orWhereRaw('LOWER(current_position) LIKE ?', ["%{$search}%"])
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
                    // Use OR to match any keyword in current_position
                    $q->orWhereRaw('LOWER(current_position) LIKE ?', ["%{$keyword}%"]);
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
            'password' => 'nullable|string|min:8', // Enforce min length
            'graduation_year' => 'required|integer|digits:4|max:' . date('Y'),
            'major' => 'required|string|max:100', 
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
        // 2. Create Alumni record
        Alumni::create([
            'user_id' => $user->id ?? null,
            'name' => $data['name'], 
            'nim' => $data['nim'],
            'graduation_year' => $data['graduation_year'],
            'major' => $data['major'],
            'phone_number' => $data['phone_number'],
            'gender' => $data['gender'],
            'address' => $data['address'],
        ]);

        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni baru berhasil ditambahkan.');
    }

    /**
     * Update the specified alumni in storage (Update).
     */
    public function update(Request $request, $id)
    {
        $alumni = Alumni::findOrFail($id);

        // Removed 'email' validation from here as admins shouldn't update it directly
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:Terverifikasi,Menunggu Verifikasi', 
            'graduation_year' => 'required|integer|digits:4',
            'current_position' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
        ]);
        
        // 1. Update Alumni details
        $alumni->update([
            'name' => $data['name'],
            'graduation_year' => $data['graduation_year'],
            'current_position' => $data['current_position'],
            'company_name' => $data['company_name'],
        ]);

        // 2. Update User/Verification Status Only
        if ($alumni->user) {
             // Update User's name if they have an account
            $alumni->user->update(['name' => $data['name']]); 

            // Update Email Verification Status
            if ($data['status'] === 'Terverifikasi') {
                if (!$alumni->user->email_verified_at) {
                    $alumni->user->email_verified_at = now();
                }
            } else {
                $alumni->user->email_verified_at = null;
            }
            
            // NOTE: Email update removed for security. 
            // If user needs to change email, they should do it from their profile
            // or request a specific admin intervention (not bulk/quick edit).

            $alumni->user->save();

        } 
        // Removed the "create new user if verified" logic in update to prevent accidental account creation with potentially wrong emails.
        // Users should register themselves or be created explicitly via "Add Alumni".

        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil diperbarui.');
    }

    /**
     * Export data to CSV.
     */
    public function export()
    {
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
                    $alumni->current_position ?? 'Belum bekerja',
                    $alumni->company_name ?? '-',
                    $alumni->user && $alumni->user->hasVerifiedEmail() ? 'Terverifikasi' : 'Pending'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $alumni = Alumni::findOrFail($id);
        
        // Security check: Prevent deleting self or other admins if they happen to be in alumni list (rare but safe)
        if ($alumni->user && $alumni->user->role === 'admin') {
             return redirect()->back()->with('error', 'Tidak dapat menghapus data administrator.');
        }
        
        if ($alumni->user) {
            $alumni->user->delete();
        }
        
        $alumni->delete();

        return redirect()->back()->with('success', 'Data alumni berhasil dihapus.');
    }
}