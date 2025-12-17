<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Http\Resources\AlumniResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PublicAlumniController extends Controller
{
    public function index(Request $request)
    {
        $query = Alumni::with('skills')->whereNotNull('avatar');

        // 1. SEARCH (REFACTORED: Type-safe query builder with DB::raw)
        if ($request->has('search')) {
            // Clean extra spaces & convert to lowercase
            $search = trim($request->input('search'));
            $term = strtolower($search); 

            $query->where(function($q) use ($term) {
                // Refactored from whereRaw to use Laravel's type-safe query builder
                $q->where(DB::raw('LOWER(name)'), 'like', "%{$term}%")
                  // Search in Job History (Position & Company)
                  ->orWhereHas('jobHistories', function($jq) use ($term) {
                      $jq->where(DB::raw('LOWER(position)'), 'like', "%{$term}%")
                         ->orWhere(DB::raw('LOWER(company_name)'), 'like', "%{$term}%");
                  })
                  // Search in Skills
                  ->orWhereHas('skills', function($sq) use ($term) {
                      $sq->where(DB::raw('LOWER(name)'), 'like', "%{$term}%");
                  });
            });
        }

        // 2. FILTER CATEGORY (Expanded Keywords)
        if ($request->has('category') && $request->category !== 'All') {
            $cat = $request->category;
            
            // Keyword Mapping
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
                        // Refactored from whereRaw to type-safe query builder
                        $q->orWhereHas('jobHistories', function($jq) use ($word) {
                            $jq->where(DB::raw('LOWER(position)'), 'like', "%{$word}%");
                        });
                    }
                });
            }
        }

        // Pagination
        $alumni = $query->inRandomOrder()->paginate(12)->withQueryString();

        return Inertia::render('Directory', [
            // SECURITY FIX: Use AlumniResource to enforce PII privacy at API level
            'alumni' => AlumniResource::collection($alumni),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show($id)
    {
        $alumni = Alumni::with(['skills', 'jobHistories']) 
            ->findOrFail($id);

        // SECURITY FIX: Use AlumniResource - privacy is enforced at the resource level
        // No need to manually unset relations or check privacy flags here
        return Inertia::render('Alumni/Detail', [
            'alumni' => new AlumniResource($alumni)
        ]);
    }
}
