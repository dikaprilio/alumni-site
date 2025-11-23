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
    protected $appends = ['profile_completeness', 'current_job'];

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
        $total_criteria = 5; 

        // 1. Contact Info
        if (!empty($this->phone_number) && !empty($this->address)) {
            $points++;
        }

        // 2. LinkedIn
        if (!empty($this->linkedin_url)) {
            $points++;
        }

        // 3. Job Status (Cek dari relasi, bukan kolom tabel lagi)
        if ($this->jobHistories()->exists()) {
            $points++;
        }

        // 4. Skills
        if ($this->skills()->exists()) {
            $points++;
        }

        // 5. Experience (Sama dengan poin 3, bisa disesuaikan logikanya)
        // Misalnya: Poin 3 untuk "Punya Pekerjaan Saat Ini", Poin 5 untuk "Punya Riwayat Apapun"
        if ($this->jobHistories()->whereNotNull('end_date')->exists() || $this->jobHistories()->exists()) {
            $points++;
        }

        return round(($points / $total_criteria) * 100);
    }
}