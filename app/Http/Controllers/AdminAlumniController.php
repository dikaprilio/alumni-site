<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\User;
use App\Exports\AlumniExport;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminAlumniController extends Controller
{

    private function getFilteredQuery(Request $request)
    {
        $query = Alumni::with('user');

        // 1. SMART SEARCH
        if ($request->filled('search')) {
            $search = $request->input('search');
            $keywords = array_filter(explode(' ', $search)); 

            $query->where(function($q) use ($keywords) {
                foreach ($keywords as $word) {
                    $q->where(function($subQ) use ($word) {
                        $subQ->where('name', 'like', "%{$word}%")
                             ->orWhere('nim', 'like', "%{$word}%")
                             ->orWhere('major', 'like', "%{$word}%")
                             ->orWhere('address', 'like', "%{$word}%")
                             ->orWhere('graduation_year', 'like', "%{$word}%")
                             // Search in Job History (Position & Company)
                             ->orWhereHas('jobHistories', function($jobQ) use ($word) {
                                 $jobQ->where('position', 'like', "%{$word}%")
                                      ->orWhere('company_name', 'like', "%{$word}%");
                             })
                             ->orWhereHas('user', function($u) use ($word) {
                                 $u->where('email', 'like', "%{$word}%");
                             });
                    });
                }
            });
        }

        // 2. FILTERS
        if ($request->filled('graduation_year')) {
            $query->where('graduation_year', $request->input('graduation_year'));
        }

        if ($request->filled('employment_status')) {
            $status = $request->input('employment_status');
            if ($status === 'employed') {
                // Has at least one active job (end_date is NULL)
                $query->whereHas('jobHistories', function($q) {
                    $q->whereNull('end_date');
                });
            } elseif ($status === 'unemployed') {
                // No active jobs
                $query->whereDoesntHave('jobHistories', function($q) {
                    $q->whereNull('end_date');
                });
            }
        }

        if ($request->filled('has_account')) {
            $status = $request->input('has_account');
            if ($status === 'yes') $query->whereNotNull('user_id');
            elseif ($status === 'no') $query->whereNull('user_id');
        }
        
        if ($request->filled('location')) {
             $query->where('address', 'like', '%' . $request->input('location') . '%');
        }

        // 3. SORTING LOGIC (FIXED)
        if ($request->filled('sort_by') && $request->filled('sort_dir')) {
            $sortBy = $request->input('sort_by');
            $sortDir = $request->input('sort_dir') === 'desc' ? 'desc' : 'asc';

            // Mapping kolom yang valid untuk di-sort
            $validColumns = ['name', 'graduation_year', 'nim', 'created_at'];

            if (in_array($sortBy, $validColumns)) {
                $query->orderBy($sortBy, $sortDir);
            } 
            // Logic khusus untuk sort "Kelengkapan Profil" (profile_completeness)
            // Kita hitung skor manual via SQL agar bisa di-sort
            elseif ($sortBy === 'profile_completeness') {
                $query->orderByRaw("
                    (CASE WHEN phone_number IS NOT NULL AND phone_number != '' THEN 1 ELSE 0 END +
                     CASE WHEN address IS NOT NULL AND address != '' THEN 1 ELSE 0 END +
                     CASE WHEN linkedin_url IS NOT NULL AND linkedin_url != '' THEN 1 ELSE 0 END +
                     (SELECT COUNT(*) FROM job_histories WHERE job_histories.alumni_id = alumnis.id LIMIT 1) +
                     (SELECT COUNT(*) FROM alumni_skill WHERE alumni_skill.alumni_id = alumnis.id LIMIT 1)
                    ) $sortDir
                ");
            } else {
                $query->latest(); // Default fallback
            }
        } else {
            $query->latest(); // Default jika tidak ada sorting
        }

        return $query;
    }

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery($request);

        // Eager load jobHistories for display
        $alumni = $query->with(['jobHistories' => function($q) {
            $q->whereNull('end_date')->latest('start_date');
        }])->paginate(10)->withQueryString();

        $graduationYears = Alumni::select('graduation_year')
            ->whereNotNull('graduation_year')
            ->distinct()
            ->orderBy('graduation_year', 'desc')
            ->pluck('graduation_year');

        return Inertia::render('Admin/Alumni/Index', [
            'alumni' => $alumni,
            'filters' => $request->all(),
            'graduationYears' => $graduationYears,
        ]);
    }

    public function export(Request $request)
    {
        $query = $this->getFilteredQuery($request);
        
        // Eager load jobHistories to avoid N+1 in Export
        $query->with(['jobHistories' => function($q) {
            $q->whereNull('end_date')->latest('start_date');
        }]);

        $type = $request->input('type', 'xlsx');
        $timestamp = date('Y-m-d_H-i');
        $filename = "data_alumni_{$timestamp}.{$type}";

        if ($type === 'pdf') {
            $data = $query->get();
            $pdf = Pdf::loadView('exports.alumni_pdf', ['alumni' => $data])
                      ->setPaper('a4', 'landscape');
            return $pdf->download($filename);
        } else {
            return Excel::download(new AlumniExport($query), $filename);
        }
    }

    public function create()
    {
        return Inertia::render('Admin/Alumni/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|unique:alumnis,nim',
            'graduation_year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'major' => 'required|string',
            'email' => 'nullable|email|unique:users,email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'bio' => 'nullable|string|max:1000',
            'current_position' => 'nullable|string|max:100',
            'company_name' => 'nullable|string|max:100',
        ]);

        // Tidak menggunakan transaction seperti News/Events untuk kompatibilitas dengan Neon PostgreSQL
        try {
            $userId = null;
            if ($request->filled('email')) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make('password'),
                    'role' => 'alumni',
                ]);
                $userId = $user->id;
            }

            // Pastikan graduation_year adalah integer dan handle null values
            $alumni = Alumni::create([
                'user_id' => $userId,
                'name' => $request->name,
                'nim' => $request->nim,
                'graduation_year' => (int) $request->graduation_year,
                'major' => $request->major,
                'address' => $request->address ?? null,
                'phone_number' => $request->phone_number ?? null,
                'bio' => $request->bio ?? null,
                // 'current_position' => $request->current_position, // Removed
                // 'company_name' => $request->company_name, // Removed
            ]);

            // Create Job History if provided
            if ($request->filled('current_position') && $request->filled('company_name')) {
                $alumni->jobHistories()->create([
                    'position' => $request->current_position,
                    'company_name' => $request->company_name,
                    'start_date' => now(),
                    'end_date' => null, // Active
                ]);
            }
        } catch (\Exception $e) {
            Log::error('AdminAlumniController@store Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data. ' . $e->getMessage()]);
        }
        
        // Log activity (setelah commit berhasil, jangan sampai error logging menyebabkan rollback)
        try {
            ActivityLogger::log(
                'ADMIN_CREATE_ALUMNI', 
                "Membuat data alumni: {$alumni->name} (NIM: {$alumni->nim})" . ($userId ? ' dengan akun user' : ' tanpa akun user'),
                ['alumni_id' => $alumni->id, 'nim' => $alumni->nim, 'has_account' => (bool)$userId]
            );
        } catch (\Exception $e) {
            // Log error tapi jangan gagalkan response karena data sudah tersimpan
            Log::warning('ActivityLogger failed in AdminAlumniController@store: ' . $e->getMessage());
        }
        
        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil ditambahkan.');
    }

    public function edit($id)
    {
        // Load active job for editing
        $alumni = Alumni::with(['user', 'jobHistories' => function($q) {
            $q->whereNull('end_date')->latest('start_date');
        }])->findOrFail($id);

        // Append current_position and company_name for frontend compatibility if needed, 
        // or let the frontend read from jobHistories[0]
        // But since we added accessors in Model, it might be auto-appended if we used append.
        // However, for editing, we might want to explicitly pass it if the frontend expects it in the root object.
        // The frontend Edit.jsx likely expects 'current_position' in the alumni object.
        // The accessors I added to the model should handle `$alumni->current_position` reads.
        
        return Inertia::render('Admin/Alumni/Edit', [
            'alumni' => $alumni
        ]);
    }

    public function update(Request $request, $id)
    {
        $alumni = Alumni::with('user')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|unique:alumnis,nim,' . $id,
            'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'major' => 'required|string',
            'email' => 'nullable|email|max:255|unique:users,email,' . ($alumni->user_id ?? 'NULL'),
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'bio' => 'nullable|string|max:1000',
            'current_position' => 'nullable|string|max:100',
            'company_name' => 'nullable|string|max:100',
        ]);

        // Tidak menggunakan transaction seperti News/Events untuk kompatibilitas dengan Neon PostgreSQL
        try {
            // Update hanya field yang ada di request (handle null values dengan benar)
            $updateData = [
                'name' => $request->name,
                'nim' => $request->nim,
                'graduation_year' => (int) $request->graduation_year,
                'major' => $request->major,
                'address' => $request->address ?? null,
                'phone_number' => $request->phone_number ?? null,
                'bio' => $request->bio ?? null,
            ];
            
            $alumni->update($updateData);

            // Update Job History
            if ($request->has('current_position') || $request->has('company_name')) {
                $position = $request->input('current_position');
                $company = $request->input('company_name');

                // Find active job
                $activeJob = $alumni->jobHistories()->whereNull('end_date')->first();

                if ($position && $company) {
                    if ($activeJob) {
                        $activeJob->update([
                            'position' => $position,
                            'company_name' => $company,
                        ]);
                    } else {
                        $alumni->jobHistories()->create([
                            'position' => $position,
                            'company_name' => $company,
                            'start_date' => now(),
                            'end_date' => null,
                        ]);
                    }
                } elseif ($activeJob && empty($position) && empty($company)) {
                    // If fields cleared, maybe end the job? Or delete?
                    // For now, let's assume clearing means "no longer working there" -> end date now?
                    // Or just delete if it was a mistake?
                    // Let's just update it to empty or delete if that's the intention.
                    // But usually "required" validation prevents empty.
                    // If not required, and empty, maybe do nothing or remove.
                }
            }

            if ($request->filled('email')) {
                if ($alumni->user) {
                    $alumni->user->update([
                        'email' => $request->email,
                        'name' => $request->name,
                    ]);
                } else {
                    $newUser = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make('password'),
                        'role' => 'alumni',
                    ]);
                    
                    $alumni->update(['user_id' => $newUser->id]);
                }
            }
        } catch (\Exception $e) {
            Log::error('AdminAlumniController@update Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'alumni_id' => $id
            ]);
            return back()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
        
        // Log activity (setelah commit berhasil, jangan sampai error logging menyebabkan rollback)
        try {
            ActivityLogger::log(
                'ADMIN_UPDATE_ALUMNI',
                "Memperbarui data alumni: {$alumni->name} (NIM: {$alumni->nim})",
                ['alumni_id' => $alumni->id, 'nim' => $alumni->nim]
            );
        } catch (\Exception $e) {
            // Log error tapi jangan gagalkan response karena data sudah tersimpan
            Log::warning('ActivityLogger failed in AdminAlumniController@update: ' . $e->getMessage());
        }
        
        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil diperbarui.');
    }

    public function destroy($id)
{
    $alumni = Alumni::findOrFail($id);
    $alumniName = $alumni->name;
    $alumniNim = $alumni->nim;
    $hadAccount = (bool)$alumni->user_id;
    
    if ($alumni->user_id) {
        User::destroy($alumni->user_id);
    }
    
    $alumni->delete();
    
    // Log activity
    ActivityLogger::log(
        'ADMIN_DELETE_ALUMNI',
        "Menghapus data alumni: {$alumniName} (NIM: {$alumniNim})" . ($hadAccount ? ' beserta akun user' : ''),
        ['nim' => $alumniNim, 'had_account' => $hadAccount]
    );

    return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil dihapus.');
}    

    public function toggleFeatured(Request $request, $id)
    {
        $alumni = Alumni::findOrFail($id);
        
        if ($alumni->featured_at) {
            $alumni->update([
                'featured_at' => null,
                'featured_reason' => null
            ]);
            return back()->with('success', 'Status Alumni of the Month dicabut.');
        } 
        
        $reason = $request->input('featured_reason', 'Kontribusi luar biasa di bidang profesional.');
        
        $alumni->update([
            'featured_at' => now(),
            'featured_reason' => $reason
        ]);

        return back()->with('success', 'Alumni berhasil dijadikan Alumni of the Month!');
    }
}