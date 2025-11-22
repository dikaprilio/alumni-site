<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminAlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = Alumni::with('user');

        // 1. SMART SEARCH (Global Search)
        // Mencari satu keyword di berbagai kolom relevan
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('major', 'like', "%{$search}%")
                  ->orWhere('current_position', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%") // Termasuk lokasi
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('email', 'like', "%{$search}%");
                  });
            });
        }

        // 2. FILTER: ANGKATAN (Graduation Year)
        if ($request->filled('graduation_year')) {
            $query->where('graduation_year', $request->input('graduation_year'));
        }

        // 3. FILTER: STATUS KERJA (Employment Status)
        // Asumsi: Jika 'current_position' diisi, berarti sedang bekerja
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

        // 4. FILTER: STATUS AKUN (Has Account)
        if ($request->filled('has_account')) {
            $status = $request->input('has_account');
            if ($status === 'yes') {
                $query->whereNotNull('user_id');
            } elseif ($status === 'no') {
                $query->whereNull('user_id');
            }
        }

        // 5. FILTER: LOKASI (Specific Location Filter)
        if ($request->filled('location')) {
            $query->where('address', 'like', '%' . $request->input('location') . '%');
        }

        // 6. FILTER: KARIR (Specific Career/Company Filter)
        if ($request->filled('career')) {
            $term = $request->input('career');
            $query->where(function($q) use ($term) {
                $q->where('current_position', 'like', "%{$term}%")
                  ->orWhere('company_name', 'like', "%{$term}%");
            });
        }

        // SORTING
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        $allowedSorts = ['name', 'nim', 'graduation_year', 'created_at', 'major'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $alumni = $query->paginate(10)->withQueryString();

        // Ambil daftar tahun kelulusan unik untuk opsi filter dropdown
        $graduationYears = Alumni::select('graduation_year')
            ->whereNotNull('graduation_year')
            ->distinct()
            ->orderBy('graduation_year', 'desc')
            ->pluck('graduation_year');

        return Inertia::render('Admin/Alumni/Index', [
            'alumni' => $alumni,
            'filters' => $request->all(), // Mengirim semua input filter kembali ke frontend
            'graduationYears' => $graduationYears, // List tahun untuk dropdown
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Alumni/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|unique:alumnis,nim|max:20',
            'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'major' => 'required|string',
            'email' => 'nullable|email|unique:users,email',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $alumni = Alumni::create($request->except('email'));

        if ($request->filled('email')) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make('password'),
                'role' => 'alumni',
            ]);
            
            $alumni->user_id = $user->id;
            $alumni->save();
        }

        return redirect()->route('admin.alumni.index')->with('message', 'Alumni berhasil ditambahkan.');
    }

    public function edit(Alumni $alumni)
    {
        $alumni->load('user'); 
        
        return Inertia::render('Admin/Alumni/Edit', [
            'alumni' => $alumni
        ]);
    }

    public function update(Request $request, Alumni $alumni)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|max:20|unique:alumnis,nim,' . $alumni->id,
            'graduation_year' => 'required|integer',
            'major' => 'required|string',
            'current_position' => 'nullable|string',
            'company_name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email,' . ($alumni->user_id ?? 'NULL'),
        ]);

        $alumni->update($request->except('email'));

        if ($request->filled('email')) {
            if ($alumni->user) {
                $alumni->user->update(['email' => $validated['email'], 'name' => $validated['name']]);
            } else {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make('password'),
                    'role' => 'alumni',
                ]);
                $alumni->user_id = $user->id;
                $alumni->save();
            }
        }

        return redirect()->route('admin.alumni.index')->with('message', 'Data alumni diperbarui.');
    }

    public function destroy(Alumni $alumni)
    {
        if ($alumni->user) {
            $alumni->user->delete();
        }
        $alumni->delete();

        return redirect()->route('admin.alumni.index')->with('message', 'Alumni dihapus.');
    }
    
    public function generateAccount(Alumni $alumni)
    {
        if ($alumni->user_id) {
            return back()->with('error', 'Alumni ini sudah memiliki akun.');
        }

        $email = $alumni->email ?? strtolower($alumni->nim) . '@alumni.com';
        
        $user = User::create([
            'name' => $alumni->name,
            'email' => $email,
            'password' => Hash::make('password'),
            'role' => 'alumni',
        ]);

        $alumni->user_id = $user->id;
        $alumni->save();

        return back()->with('message', 'Akun berhasil dibuatkan. Password default: password');
    }
}