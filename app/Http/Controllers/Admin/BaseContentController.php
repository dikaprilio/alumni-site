<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

abstract class BaseContentController extends Controller
{
    protected $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }

    // metod abstrak polymorphism
    abstract protected function getModel();
    abstract protected function getModelName();
    abstract protected function getRoutePrefix();
    abstract protected function getViewPath();
    abstract protected function getValidationRules(Request $request, $model = null);
    abstract protected function getSearchFields();
    abstract protected function getOrderByColumn();
    abstract protected function getContentFieldName(); // 'content' or 'description'

    // Common index method
    public function index(Request $request)
    {
        $model = $this->getModel();
        $orderBy = $this->getOrderByColumn();
        
        // Build query with eager loading if needed
        $query = $model::query();
        
        // Add eager loading for News model (has author relationship)
        if ($this->getModelName() === 'news') {
            $query->with('author');
        }
        
        // Order by
        if ($orderBy === 'created_at') {
            $query->latest();
        } else {
            $query->latest($orderBy);
        }

        // Search Logic
        if ($request->has('search')) {
            $search = $request->search;
            $searchFields = $this->getSearchFields();
            
            $query->where(function($q) use ($search, $searchFields) {
                foreach ($searchFields as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        // Category Filter
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // Pagination
        $items = $query->paginate(10)->withQueryString();

        $viewPath = $this->getViewPath();
        $modelName = $this->getModelName();

        return Inertia::render("{$viewPath}/Index", [
            $modelName => $items,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    // Common create method
    public function create()
    {
        $viewPath = $this->getViewPath();
        return Inertia::render("{$viewPath}/Create");
    }

    // Common store method
    public function store(Request $request)
    {
        $validated = $request->validate($this->getValidationRules($request));
        $model = $this->getModel();

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageUploadService->upload(
                $request->file('image'), 
                $this->getModelName(), 
                1200
            );
        }

        // Prepare data for creation
        $data = [
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'category' => $validated['category'],
            'slug' => Str::slug($validated['title']) . '-' . time(),
            'image' => $imagePath,
        ];

        // Handle content/description field name difference
        $contentField = $this->getContentFieldName();
        $data[$contentField] = $validated[$contentField];

        // Add model-specific fields (e.g., event_date, location for Event)
        if (isset($validated['event_date'])) {
            $data['event_date'] = $validated['event_date'];
        }
        if (isset($validated['location'])) {
            $data['location'] = $validated['location'];
        }

        $item = $model::create($data);

        // Log activity
        $this->logActivity(
            'CREATE',
            "Membuat {$this->getModelName()}: {$validated['title']}",
            $this->getActivityProperties($item, $validated)
        );

        return redirect()
            ->route("{$this->getRoutePrefix()}.index")
            ->with('success', $this->getSuccessMessage('created'));
    }

    // Common show method (for resource routes)
    public function show($id)
    {
        // Redirect to edit for now, or implement show view if needed
        return redirect()->route("{$this->getRoutePrefix()}.edit", $id);
    }

    // Common edit method
    public function edit($id)
    {
        $model = $this->getModel();
        $item = $model::findOrFail($id);
        $viewPath = $this->getViewPath();
        $modelName = $this->getModelName();

        return Inertia::render("{$viewPath}/Edit", [
            $modelName => $item
        ]);
    }

    // Common update method
    public function update(Request $request, $id)
    {
        $model = $this->getModel();
        $item = $model::findOrFail($id);

        $validated = $request->validate($this->getValidationRules($request, $item));

        // Update slug if title changed
        if ($request->title !== $item->title) {
            $item->slug = Str::slug($request->title) . '-' . time();
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            $this->imageUploadService->delete($item->image);
            // Upload new image
            $item->image = $this->imageUploadService->upload(
                $request->file('image'), 
                $this->getModelName(), 
                1200
            );
        }

        // Update item (exclude image from validated as it's handled separately)
        $updateData = $validated;
        if ($request->hasFile('image')) {
            $updateData['image'] = $item->image; // Set the new image path
        }
        $item->update($updateData);

        // Log activity
        $this->logActivity(
            'UPDATE',
            "Memperbarui {$this->getModelName()}: {$item->title}",
            $this->getActivityProperties($item, $validated)
        );

        return redirect()
            ->route("{$this->getRoutePrefix()}.index")
            ->with('success', $this->getSuccessMessage('updated'));
    }

    // Common destroy method
    public function destroy($id)
    {
        $model = $this->getModel();
        $item = $model::findOrFail($id);
        $itemTitle = $item->title;
        $itemProperties = $this->getActivityProperties($item);

        // Delete image
        $this->imageUploadService->delete($item->image);

        $item->delete();

        // Log activity
        $this->logActivity(
            'DELETE',
            "Menghapus {$this->getModelName()}: {$itemTitle}",
            $itemProperties
        );

        return redirect()
            ->back()
            ->with('success', $this->getSuccessMessage('deleted'));
    }

    // Helper: Log activity
    protected function logActivity($action, $description, $properties = [])
    {
        $modelName = strtoupper($this->getModelName());
        ActivityLogger::log(
            "ADMIN_{$action}_{$modelName}",
            $description,
            $properties
        );
    }

    // Helper: Get activity properties
    protected function getActivityProperties($item, $validated = [])
    {
        $properties = [
            'id' => $item->id,
            'title' => $item->title,
        ];

        // Add model-specific properties
        if (isset($item->category)) {
            $properties['category'] = $item->category;
        }
        if (isset($item->event_date)) {
            $properties['event_date'] = $item->event_date;
        }
        if (isset($item->location)) {
            $properties['location'] = $item->location;
        }

        return array_merge($properties, $validated);
    }

    // Helper: Get success messages
    protected function getSuccessMessage($action)
    {
        $messages = [
            'created' => [
                'news' => 'Berita berhasil diterbitkan.',
                'event' => 'Agenda acara berhasil dibuat.',
            ],
            'updated' => [
                'news' => 'Berita berhasil diperbarui.',
                'event' => 'Agenda acara berhasil diperbarui.',
            ],
            'deleted' => [
                'news' => 'Berita berhasil dihapus.',
                'event' => 'Agenda acara berhasil dihapus.',
            ],
        ];

        return $messages[$action][$this->getModelName()] ?? 'Operasi berhasil.';
    }
}

