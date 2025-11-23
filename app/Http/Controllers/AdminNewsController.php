<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminNewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::with('author')->latest();

        // 1. Search Logic
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // 2. Category Filter
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // 3. Pagination
        $news = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/News/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
        }

        News::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'category' => $request->category,
            'slug' => Str::slug($request->title) . '-' . time(),
            'content' => $request->content,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diterbitkan.');
    }

    public function edit($id)
    {
        $news = News::findOrFail($id);
        return Inertia::render('Admin/News/Edit', [
            'news' => $news
        ]);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->title !== $news->title) {
            $news->slug = Str::slug($request->title) . '-' . time();
        }

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($news->image && Storage::disk('public')->exists($news->image)) {
                Storage::disk('public')->delete($news->image);
            }
            $news->image = $request->file('image')->store('news', 'public');
        }

        $news->update([
            'title' => $request->title,
            'category' => $request->category,
            'content' => $request->content,
        ]);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        
        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }
        
        $news->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }
}