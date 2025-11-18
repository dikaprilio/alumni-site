<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'event_date',
        'location',
        'image',
        'status'
    ];

    // Nanti bisa tambah relasi ke pendaftar event disini
    // public function registrations() { ... }
}