<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    protected $manager;

    public function __construct()
    {
        // Setup ImageManager with GD driver
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Upload image, resize (optional), convert to WebP, and save to storage.
     *
     * @param UploadedFile $file
     * @param string $path Directory path (e.g., 'news', 'alumni')
     * @param int|null $width
     * @param int|null $height
     * @return string The relative path to the saved image
     * @throws \InvalidArgumentException If file is not a valid image type
     */
    public function upload(UploadedFile $file, string $path, ?int $width = null, ?int $height = null): string
    {
        // SECURITY: Defense in depth - validate MIME type regardless of controller validation
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!in_array($file->getMimeType(), $allowedMimes, true)) {
            throw new \InvalidArgumentException(
                'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed. Received: ' . $file->getMimeType()
            );
        }

        // Create unique filename
        $filename = Str::uuid() . '.webp';
        $fullPath = $path . '/' . $filename;

        // Read image
        $image = $this->manager->read($file);

        // Resize if dimensions provided
        if ($width || $height) {
            $image->scale(width: $width, height: $height);
        }

        // Encode to WebP with 80% quality
        $encoded = $image->toWebp(80);

        // Save to storage (public disk)
        Storage::disk('public')->put($fullPath, (string) $encoded);

        return $fullPath;
    }

    /**
     * Delete an image from storage.
     * 
     * @param string|null $path
     * @return bool
     */
    public function delete(?string $path): bool
    {
        if (!$path) return false;
        
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        
        return false;
    }
}
