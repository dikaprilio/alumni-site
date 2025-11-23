<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\User;
use App\Exports\AlumniExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminAlumniController extends Controller
{
    /**
     * PRIVATE HELPER: Pusat logic filter & Sorting
     */
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
                             ->orWhere('company_name', 'like', "%{$word}%")
                             ->orWhere('current_position', 'like', "%{$word}%")
                             ->orWhere('address', 'like', "%{$word}%")
                             ->orWhere('graduation_year', 'like', "%{$word}%")
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
                $query->whereNotNull('current_position')->where('current_position', '!=', '');
            } elseif ($status === 'unemployed') {
                $query->where(function($q) {
                    $q->whereNull('current_position')->orWhere('current_position', '=', '');
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
                     CASE WHEN current_position IS NOT NULL AND current_position != '' THEN 1 ELSE 0 END +
                     (SELECT COUNT(*) FROM alumni_skill WHERE alumni_skill.alumni_id = alumnis.id LIMIT 1) +
                     (SELECT COUNT(*) FROM job_histories WHERE job_histories.alumni_id = alumnis.id LIMIT 1)
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

        $alumni = $query->paginate(10)->withQueryString();

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
            'email' => 'nullable|email|unique:users,email',
        ]);

        DB::beginTransaction();
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

            Alumni::create([
                'user_id' => $userId,
                'name' => $request->name,
                'nim' => $request->nim,
                'graduation_year' => $request->graduation_year,
                'major' => $request->major,
                'place_of_birth' => $request->place_of_birth,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
                'current_position' => $request->current_position,
                'company_name' => $request->company_name,
            ]);

            DB::commit();
            return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data. ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $alumni = Alumni::with('user')->findOrFail($id);

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
            'graduation_year' => 'required|integer',
            'major' => 'required|string',
            'email' => 'nullable|email|unique:users,email,' . ($alumni->user_id ?? 'NULL'),
        ]);

        DB::beginTransaction();
        try {
            $alumni->update([
                'name' => $request->name,
                'nim' => $request->nim,
                'graduation_year' => $request->graduation_year,
                'major' => $request->major,
                'current_position' => $request->current_position,
                'company_name' => $request->company_name,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
                'bio' => $request->bio,
            ]);

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

            DB::commit();
            return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $alumni = Alumni::findOrFail($id);
        
        if ($alumni->user_id) {
            User::destroy($alumni->user_id);
        }
        
        $alumni->delete();

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