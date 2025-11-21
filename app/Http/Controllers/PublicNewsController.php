<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicNewsController extends Controller
{
    public function index(Request $request)
    {
        // 1. Filter Type: 'news' atau 'event' (Default: news)
        $type = $request->input('type', 'news');
        $search = $request->input('search');

        // 2. Query Builder
        if ($type === 'event') {
            $query = Event::query();
            // Search logic untuk Event
            if ($search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
            }
            // Urutkan berdasarkan tanggal event terdekat
            $query->orderBy('event_date', 'desc');
        } else {
            // Default: News
            $query = News::query();
            // Search logic untuk News
            if ($search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            }
            // Urutkan terbaru
            $query->latest();
        }

        // 3. Filter Kategori (Optional, jika ada)
        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        // 4. Pagination (9 item per halaman agar pas grid 3x3)
        $items = $query->paginate(9)->withQueryString();

        // 5. Mapping Data (Standarisasi agar Frontend mudah membacanya)
        // Kita ubah collectionnya agar field-nya seragam (title, date, image, category)
        $items->through(function ($item) use ($type) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug ?? $item->id, // Fallback jika belum ada slug
                'category' => $item->category ?? 'General',
                'image' => $item->image,
                'date' => $type === 'event' ? $item->event_date : $item->created_at,
                'location' => $type === 'event' ? $item->location : null, // Khusus Event
                'type' => strtoupper($type), // Label 'NEWS' atau 'EVENT'
                'excerpt' => \Illuminate\Support\Str::limit(strip_tags($item->content ?? $item->description), 100),
            ];
        });

        return Inertia::render('News/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'type', 'category']),
        ]);
    }

    public function showNews($id)
    {
        $news = News::findOrFail($id);
        return Inertia::render('News/Detail', ['article' => $news, 'type' => 'NEWS']);
    }

    public function showEvent($id)
    {
        $event = Event::findOrFail($id);
        return Inertia::render('News/Detail', ['article' => $event, 'type' => 'EVENT']);
    }
}