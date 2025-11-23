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
        // 'current_position', // Dihapus (Normalized)
        // 'company_name',     // Dihapus (Normalized)
        'linkedin_url',
        'avatar',
        'bio',
        'private_email',
        'private_phone',
        'featured_at',
        'featured_reason',
    ];

    protected $casts = [
        'private_email' => 'boolean',
        'private_phone' => 'boolean',
        'featured_at' => 'datetime',
    ];

    protected $with = ['user'];

    // Tambahkan 'current_job' ke output JSON
    protected $appends = ['profile_completeness', 'current_job', 'missing_fields'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobHistories()
    {
        return $this->hasMany(JobHistory::class)->orderBy('start_date', 'desc');
    }

    // Helper: Ambil pekerjaan terbaru (yang end_date-nya kosong atau paling baru)
    public function latestJob()
    {
        return $this->hasOne(JobHistory::class)->latestOfMany('start_date');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'alumni_skill');
    }

    public function opportunities()
    {
        return $this->hasMany(Opportunity::class);
    }

    /**
     * Accessor: Mendapatkan Current Position & Company secara dinamis
     * Mengembalikan null jika tidak ada pekerjaan, atau object job history jika ada.
     */
    public function getCurrentJobAttribute()
    {
        // Cari pekerjaan yang sedang aktif (end_date NULL)
        $activeJob = $this->jobHistories->whereNull('end_date')->first();
        
        if ($activeJob) {
            return $activeJob;
        }

        // Jika tidak ada yang aktif, kembalikan pekerjaan terakhir (opsional)
        return $this->latestJob;
    }

    public function getCurrentPositionAttribute()
    {
        return $this->current_job ? $this->current_job->job_title : null;
    }

    public function getCompanyNameAttribute()
    {
        return $this->current_job ? $this->current_job->company_name : null;
    }

    /**
     * Gamification: Calculate Profile Completeness (0-100%)
     */
    public function getProfileCompletenessAttribute()
    {
        $points = 0;
        $total_criteria = 6; // HARUS 6 KRITERIA

        // 1. Contact Info (Phone & Address)
        if (!empty($this->phone_number) && !empty($this->address)) {
            $points++;
        }

        // 2. LinkedIn
        if (!empty($this->linkedin_url)) {
            $points++;
        }

        // 3. Job Status (Current Position) - Cek apakah ada pekerjaan aktif (end_date NULL)
        // Logika di Edit.jsx: alumni.job_histories.some(job => !job.end_date)
        if ($this->jobHistories()->whereNull('end_date')->exists()) {
            $points++;
        }

        // 4. Skills
        if ($this->skills()->exists()) {
            $points++;
        }

        // 5. Bio (Harus ada dan > 20 karakter)
        // Logika di Edit.jsx: data.bio && data.bio.length > 20
        if (!empty($this->bio) && strlen($this->bio) > 20) {
            $points++;
        }
        
        // 6. Experience (Work History) - Cek apakah ada riwayat pekerjaan sama sekali
        // Logika di Edit.jsx: alumni.job_histories.length > 0
        if ($this->jobHistories()->exists()) {
            $points++;
        }

        return round(($points / $total_criteria) * 100);
    }
    public function getMissingFieldsAttribute()
    {
        $missing = [];

        // 1. Contact Info
        if (empty($this->phone_number)) $missing[] = 'Phone';
        if (empty($this->address)) $missing[] = 'Address';

        // 2. LinkedIn
        if (empty($this->linkedin_url)) $missing[] = 'LinkedIn';

        // 3. Job Status (Current Position)
        if (!$this->jobHistories()->whereNull('end_date')->exists()) {
            $missing[] = 'Current Position';
        }

        // 4. Skills
        if (!$this->skills()->exists()) {
            $missing[] = 'Skills';
        }

        // 5. Bio
        if (empty($this->bio) || strlen($this->bio) <= 20) {
            $missing[] = 'Bio';
        }
        
        // 6. Experience (Work History)
        if (!$this->jobHistories()->exists()) {
            $missing[] = 'Work History';
        }

        return $missing;
    }
}