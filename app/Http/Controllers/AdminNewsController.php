<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Services\ActivityLogger;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminNewsController extends Controller
{
    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Upload and convert to WebP, max width 1200px
            $imagePath = $this->imageUploadService->upload($request->file('image'), 'news', 1200);
        }

        News::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'category' => $request->category,
            'slug' => Str::slug($request->title) . '-' . time(),
            'content' => $request->content,
            'image' => $imagePath,
        ]);
        
        // Log activity
        ActivityLogger::log(
            'ADMIN_CREATE_NEWS',
            "Membuat berita: {$request->title}",
            ['title' => $request->title, 'category' => $request->category]
        );

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->title !== $news->title) {
            $news->slug = Str::slug($request->title) . '-' . time();
        }

        if ($request->hasFile('image')) {
            // Delete old image
            $this->imageUploadService->delete($news->image);
            // Upload new image
            $news->image = $this->imageUploadService->upload($request->file('image'), 'news', 1200);
        }

        $news->update([
            'title' => $request->title,
            'category' => $request->category,
            'content' => $request->content,
        ]);
        
        // Log activity
        ActivityLogger::log(
            'ADMIN_UPDATE_NEWS',
            "Memperbarui berita: {$news->title}",
            ['news_id' => $news->id, 'title' => $news->title]
        );

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $newsTitle = $news->title;
        
        // Delete image using service
        $this->imageUploadService->delete($news->image);
        
        $news->delete();
        
        // Log activity
        ActivityLogger::log(
            'ADMIN_DELETE_NEWS',
            "Menghapus berita: {$newsTitle}",
            ['title' => $newsTitle]
        );

        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }
}