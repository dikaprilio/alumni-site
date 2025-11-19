<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name', // Kolom nama alumni
        'nim',
        'graduation_year',
        'major',
        'phone_number',
        'gender',
        'address',
        'current_job',
        'company_name', // Kolom baru tadi
        'linkedin_url',
    ];

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Alumni punya banyak Riwayat Kerja
    public function jobHistories()
    {
        return $this->hasMany(JobHistory::class);
    }

    // Alumni punya banyak Skill
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'alumni_skill');
    }
}