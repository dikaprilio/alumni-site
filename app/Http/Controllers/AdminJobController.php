<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminJobController extends Controller
{
    public function index()
    {
        $jobs = JobPosting::latest()->paginate(10);
        return view('admin.jobs.index', compact('jobs'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'job_type' => 'required|in:Full-time,Part-time,Contract,Internship,Freelance,Remote',
            'description' => 'required',
            'salary_range' => 'nullable|string|max:100',
            'application_url' => 'nullable|url',
            'closing_date' => 'nullable|date',
            'status' => 'required|in:active,closed,draft',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Logo Perusahaan
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('jobs', 'public');
        }

        JobPosting::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'company_name' => $request->company_name,
            'location' => $request->location,
            'job_type' => $request->job_type,
            'description' => $request->input('description'), // Pakai input()
            'salary_range' => $request->salary_range,
            'application_url' => $request->application_url,
            'closing_date' => $request->closing_date,
            'status' => $request->status,
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Lowongan kerja berhasil diposting.');
    }

    public function update(Request $request, $id)
    {
        $job = JobPosting::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'job_type' => 'required|in:Full-time,Part-time,Contract,Internship,Freelance,Remote',
            'description' => 'required',
            'status' => 'required|in:active,closed,draft',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->title !== $job->title) {
            $job->slug = Str::slug($request->title) . '-' . time();
        }

        if ($request->hasFile('image')) {
            if ($job->image && Storage::disk('public')->exists($job->image)) {
                Storage::disk('public')->delete($job->image);
            }
            $job->image = $request->file('image')->store('jobs', 'public');
        }

        $job->update([
            'title' => $request->title,
            'company_name' => $request->company_name,
            'location' => $request->location,
            'job_type' => $request->job_type,
            'description' => $request->input('description'),
            'salary_range' => $request->salary_range,
            'application_url' => $request->application_url,
            'closing_date' => $request->closing_date,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Lowongan kerja diperbarui.');
    }

    public function destroy($id)
    {
        $job = JobPosting::findOrFail($id);
        
        if ($job->image && Storage::disk('public')->exists($job->image)) {
            Storage::disk('public')->delete($job->image);
        }
        
        $job->delete();

        return redirect()->back()->with('success', 'Lowongan kerja dihapus.');
    }
}