<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'slug',
        'content',
        'image',
        'user_id',
        'created_at',
    ];

    // Berita ditulis oleh satu User (Admin)
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}