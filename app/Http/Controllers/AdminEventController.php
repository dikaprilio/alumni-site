<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminEventController extends Controller
{
    public function index()
    {
        $events = Event::latest()->paginate(10);
        return view('admin.events.index', compact('events'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'status' => 'required|in:upcoming,ongoing,finished',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        Event::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'description' => $request->description,
            'event_date' => $request->event_date,
            'location' => $request->location,
            'status' => $request->status,
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Event berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'status' => 'required|in:upcoming,ongoing,finished',
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
            'description' => $request->description,
            'event_date' => $request->event_date,
            'location' => $request->location,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Event berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->image && Storage::disk('public')->exists($event->image)) {
            Storage::disk('public')->delete($event->image);
        }
        
        $event->delete();

        return redirect()->back()->with('success', 'Event berhasil dihapus.');
    }
}