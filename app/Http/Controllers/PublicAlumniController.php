<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB; // <--- JANGAN LUPA INI

class PublicAlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = Alumni::with('skills')->whereNotNull('avatar');

        // 1. SEARCH (REVISI: CASE-INSENSITIVE & ROBUST)
        if ($request->has('search')) {
            // Bersihkan spasi ekstra & ubah input user ke huruf kecil
            $search = trim($request->input('search'));
            $term = strtolower($search); 

            $query->where(function($q) use ($term) {
                // Teknik 'whereRaw' dengan 'LOWER()' memastikan pencarian tidak peduli kapitalisasi
                // Ini bekerja aman di MySQL, PostgreSQL, dan SQLite
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$term}%"])
                  ->orWhereRaw('LOWER(current_position) LIKE ?', ["%{$term}%"])
                  ->orWhereRaw('LOWER(company_name) LIKE ?', ["%{$term}%"])
                  // Cari juga di dalam relasi Skills
                  ->orWhereHas('skills', function($sq) use ($term) {
                      $sq->whereRaw('LOWER(name) LIKE ?', ["%{$term}%"]);
                  });
            });
        }

        // 2. FILTER CATEGORY (Expanded Keywords)
        if ($request->has('category') && $request->category !== 'All') {
            $cat = $request->category;
            
            // Keyword Mapping yang sudah kita buat sebelumnya
            $jobKeywords = [
                'Engineering' => ['developer', 'engineer', 'programmer', 'stack', 'it', 'tech', 'software', 'web', 'mobile', 'android', 'ios', 'devops', 'sre', 'cloud'],
                'Data & AI'   => ['data', 'analyst', 'scientist', 'ai', 'machine', 'learning', 'intelligence', 'bot', 'gpt'],
                'Product'     => ['product', 'manager', 'owner', 'scrum', 'agile', 'project'],
                'Creative'    => ['design', 'ui', 'ux', 'graphic', 'art', 'creative', 'writer', 'content', 'animator', '3d', 'video', 'multimedia'],
                'Marketing'   => ['marketing', 'seo', 'sem', 'social', 'media', 'growth', 'sales', 'digital', 'ads', 'brand', 'communication', 'pr'],
                'Business'    => ['business', 'ceo', 'founder', 'cto', 'cmo', 'director', 'head', 'lead', 'strategy', 'consultant', 'hr', 'human', 'finance'],
                'Operations'  => ['admin', 'finance', 'accounting', 'legal', 'operations', 'support', 'customer', 'service', 'logistic'],
            ];

            if (array_key_exists($cat, $jobKeywords)) {
                $keywords = $jobKeywords[$cat];
                $query->where(function($q) use ($keywords) {
                    foreach ($keywords as $word) {
                        // Kita juga pakai LOWER disini untuk konsistensi
                        $q->orWhereRaw('LOWER(current_position) LIKE ?', ["%{$word}%"]);
                    }
                });
            }
        }

        // Pagination
        $alumni = $query->inRandomOrder()->paginate(12)->withQueryString();

        return Inertia::render('Directory', [
            'alumni' => $alumni,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show($id)
    {
        // Method show tetap sama seperti revisi terakhir (dengan logika privasi)
        $alumni = Alumni::with(['skills', 'jobHistories', 'user']) 
            // ->whereNotNull('avatar')
            ->findOrFail($id);

        $contactEmail = $alumni->user ? $alumni->user->email : null;

        if ($alumni->private_email) $contactEmail = null;
        if ($alumni->private_phone) $alumni->phone_number = null;

        $alumni->email = $contactEmail;
        $alumni->unsetRelation('user'); 

        return Inertia::render('Alumni/Detail', [
            'alumni' => $alumni
        ]);
    }
}