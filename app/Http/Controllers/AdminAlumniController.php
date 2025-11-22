<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\User;
use App\Exports\AlumniExport; // Nanti kita buat
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel; // Untuk Excel
use Barryvdh\DomPDF\Facade\Pdf; // Untuk PDF

class AdminAlumniController extends Controller
{
    /**
     * PRIVATE HELPER: Pusat logic filter (Smart Search)
     * Digunakan oleh Index (View) dan Export (Download)
     */
    private function getFilteredQuery(Request $request)
    {
        $query = Alumni::with('user')->latest();

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

        return $query;
    }

    public function index(Request $request)
    {
        // Panggil helper query di atas
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

    // --- NEW: EXPORT FUNCTION ---
    public function export(Request $request)
    {
        // 1. Ambil Query yang SAMA PERSIS dengan hasil search user
        $query = $this->getFilteredQuery($request);
        
        $type = $request->input('type', 'xlsx'); // Default xlsx
        $timestamp = date('Y-m-d_H-i');
        $filename = "data_alumni_{$timestamp}.{$type}";

        // 2. Export sesuai tipe
        if ($type === 'pdf') {
            // Ambil semua data (tanpa pagination)
            $data = $query->get();
            
            // Load View PDF
            $pdf = Pdf::loadView('exports.alumni_pdf', ['alumni' => $data])
                      ->setPaper('a4', 'landscape'); // Landscape agar muat banyak kolom
            
            return $pdf->download($filename);
        } else {
            // Export Excel menggunakan Class Export
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
            'email' => 'nullable|email|unique:users,email', // Cek unik di tabel users
        ]);

        DB::beginTransaction();
        try {
            // 1. Buat User baru jika email diisi
            $userId = null;
            if ($request->filled('email')) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make('password'), // Password default
                    'role' => 'alumni',
                ]);
                $userId = $user->id;
            }

            // 2. Buat Data Alumni
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
        // FIX UTAMA: Tambahkan ->with('user') agar data user (email) terbaca di Edit.jsx
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
            // Validasi email unik, kecualikan user milik alumni ini
            'email' => 'nullable|email|unique:users,email,' . ($alumni->user_id ?? 'NULL'),
        ]);

        DB::beginTransaction();
        try {
            // 1. Update Data Alumni
            $alumni->update([
                'name' => $request->name, // Update nama di alumni juga
                'nim' => $request->nim,
                'graduation_year' => $request->graduation_year,
                'major' => $request->major,
                'current_position' => $request->current_position,
                'company_name' => $request->company_name,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
                'bio' => $request->bio,
            ]);

            // 2. Handle Logic Email / User Account
            if ($request->filled('email')) {
                if ($alumni->user) {
                    // KASUS A: Alumni sudah punya akun -> Update email & namanya
                    $alumni->user->update([
                        'email' => $request->email,
                        'name' => $request->name, // Sinkronkan nama user dengan nama alumni
                    ]);
                } else {
                    // KASUS B: Alumni belum punya akun -> Buatkan akun baru
                    $newUser = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make('password'), // Default password
                        'role' => 'alumni',
                    ]);
                    
                    // Sambungkan user baru ke alumni ini
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
        
        // Opsional: Hapus user terkait jika alumni dihapus
        if ($alumni->user_id) {
            User::destroy($alumni->user_id);
        }
        
        $alumni->delete();

        return redirect()->route('admin.alumni.index')->with('success', 'Data alumni berhasil dihapus.');
    }
}