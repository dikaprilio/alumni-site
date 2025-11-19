<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminNewsController extends Controller
{
    public function index()
    {
        $news = News::with('author')->latest()->paginate(10);
        return view('admin.news.index', compact('news'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
        }

        News::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(), 
            'content' => $request->input('content'), // Menggunakan input() sesuai perbaikan
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Berita berhasil diterbitkan.');
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
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
            'content' => $request->input('content'),
        ]);

        return redirect()->back()->with('success', 'Berita berhasil diperbarui.');
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