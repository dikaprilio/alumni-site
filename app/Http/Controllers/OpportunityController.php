<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use App\Http\Resources\OpportunityResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OpportunityController extends Controller
{
    public function index()
    {
        // SECURITY: Only load alumni relation, not alumni.user
        $opportunities = Opportunity::with(['alumni'])
            ->orderBy('created_at', 'desc')
            ->get();

        // SECURITY FIX: Transform each item through OpportunityResource
        $transformed = $opportunities->map(function ($item) {
            return (new OpportunityResource($item))->resolve();
        });

        return Inertia::render('Opportunities/Index', [
            'opportunities' => $transformed
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:JOB,MENTORING',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company_name' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact_info' => ['required', 'string', 'max:255', function ($attribute, $value, $fail) {
                // 1. Cek apakah Email valid
                if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    return;
                }

                // 2. Cek apakah Nomor HP (WhatsApp) valid
                // Menerima format: +62..., 62..., 08...
                // Hanya boleh angka, +, -, dan spasi
                if (preg_match('/^(\+62|62|08)[0-9\-\s]+$/', $value)) {
                    return;
                }

                // 3. Cek apakah URL valid
                // Jika tidak ada protokol, anggap https:// untuk validasi
                $urlToCheck = $value;
                if (!preg_match('/^https?:\/\//', $value)) {
                    $urlToCheck = 'https://' . $value;
                }

                // Validasi syntax URL DAN pastikan ada titik (mencegah "ssss")
                if (!filter_var($urlToCheck, FILTER_VALIDATE_URL) || !str_contains($value, '.')) {
                    $fail('Contact info must be a valid email, URL, or WhatsApp number (+62/08...).');
                }
            }],
        ]);

        $request->user()->alumni->opportunities()->create($validated);

        return back()->with('message', 'Opportunity posted successfully!');
    }

    public function destroy($id)
    {
        $opportunity = Opportunity::findOrFail($id);

        // Ensure only owner can delete
        if ($opportunity->alumni_id !== Auth::user()->alumni->id) {
            abort(403);
        }

        $opportunity->delete();

        return back()->with('message', 'Post deleted.');
    }
}
