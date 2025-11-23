<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminEventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::latest('event_date'); // Urutkan berdasarkan tanggal event terdekat/terbaru

        // 1. Search Logic
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // 2. Category Filter
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // 3. Pagination
        $events = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'description' => 'required', // Sesuaikan dengan nama kolom di DB (description/content)
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        Event::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'category' => $request->category,
            'slug' => Str::slug($request->title) . '-' . time(),
            'event_date' => $request->event_date,
            'location' => $request->location,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.events.index')->with('success', 'Agenda acara berhasil dibuat.');
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id);
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'description' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->title !== $event->title) {
            $event->slug = Str::slug($request->title) . '-' . time();
        }

        if ($request->hasFile('image')) {
            if ($event->image && Storage::disk('public')->exists($event->image)) {
                Storage::disk('public')->delete($event->image);
            }
            $event->image = $request->file('image')->store('events', 'public');
        }

        $event->update([
            'title' => $request->title,
            'category' => $request->category,
            'event_date' => $request->event_date,
            'location' => $request->location,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.events.index')->with('success', 'Agenda acara berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->image && Storage::disk('public')->exists($event->image)) {
            Storage::disk('public')->delete($event->image);
        }
        
        $event->delete();

        return redirect()->back()->with('success', 'Agenda acara berhasil dihapus.');
    }
}