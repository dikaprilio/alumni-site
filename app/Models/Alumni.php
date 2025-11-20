<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'nim',
        'graduation_year',
        'major',
        'phone_number',
        'gender',
        'address',
        'current_job',
        'company_name',
        'linkedin_url',
        'avatar',
        'bio',
        'private_email', // Added
        'private_phone', // Added
    ];

    protected $casts = [
        'private_email' => 'boolean',
        'private_phone' => 'boolean',
    ];

    // Automatically verify user relationship
    protected $with = ['user'];

    // Append completeness score to JSON responses
    protected $appends = ['profile_completeness'];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Alumni punya banyak Riwayat Kerja
    public function jobHistories()
    {
        return $this->hasMany(JobHistory::class)->orderBy('start_year', 'desc');
    }

    // Alumni punya banyak Skill
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'alumni_skill');
    }

    /**
     * Gamification: Calculate Profile Completeness (0-100%)
     */
    public function getProfileCompletenessAttribute()
    {
        $points = 0;
        $total_criteria = 5; 

        // 1. Contact Info (Phone & Address)
        if (!empty($this->phone_number) && !empty($this->address)) {
            $points++;
        }

        // 2. LinkedIn
        if (!empty($this->linkedin_url)) {
            $points++;
        }

        // 3. Job Status
        if (!empty($this->current_job)) {
            $points++;
        }

        // 4. Skills (At least 1)
        if ($this->skills()->exists()) {
            $points++;
        }

        // 5. Experience (At least 1 job history)
        if ($this->jobHistories()->exists()) {
            $points++;
        }

        return round(($points / $total_criteria) * 100);
    }
}