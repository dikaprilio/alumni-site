<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOpportunityController extends Controller
{
    public function index(Request $request)
    {
        $query = Opportunity::with('alumni.user') // Eager load alumni & user
            ->latest();

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('company_name', 'like', '%' . $request->search . '%');
            });
        }

        $opportunities = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Opportunities/Index', [
            'opportunities' => $opportunities,
            'filters' => $request->only(['search']),
        ]);
    }

    public function destroy(Opportunity $opportunity)
    {
        $title = $opportunity->title;
        $type = $opportunity->type;
        $alumniName = $opportunity->alumni->name ?? 'Unknown';
        
        $opportunity->delete();

        // Log Activity
        ActivityLogger::log(
            'ADMIN_DELETE_OPPORTUNITY', 
            "Menghapus posting {$type}: {$title} (dari {$alumniName})",
            ['opportunity_id' => $opportunity->id, 'type' => $type, 'title' => $title]
        );

        return redirect()->back()->with('success', 'Peluang karir berhasil dihapus.');
    }
}