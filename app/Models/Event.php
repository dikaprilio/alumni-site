<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // Tambahkan ini
        'title',
        'category',
        'slug',
        'description',
        'event_date',
        'location',
        'image',
        'created_at',
        'status'
    ];

    // Relasi: Event dibuat oleh User (Admin)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}