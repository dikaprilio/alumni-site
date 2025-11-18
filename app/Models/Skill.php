<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category'];

    // Relasi Many-to-Many ke Alumni
    public function alumnis()
    {
        return $this->belongsToMany(Alumni::class, 'alumni_skill');
    }
}