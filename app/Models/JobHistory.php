<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumni_id',
        'company_name',
        'position',
        'start_date', // Ganti start_year
        'end_date',   // Ganti end_year
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // --- OTOMATISASI SINKRONISASI ---
    protected static function booted()
    {
        // Saat riwayat kerja baru DIBUAT
        static::created(function ($job) {
            $job->syncToAlumni();
        });

        // Saat riwayat kerja DIUPDATE
        static::updated(function ($job) {
            $job->syncToAlumni();
        });
        
        // Saat riwayat kerja DIHAPUS (Opsional: Reset jika yang dihapus adalah job aktif)
        static::deleted(function ($job) {
             // Logic tambahan jika diperlukan
        });
    }

    public function syncToAlumni()
    {
        // Logika: Jika pekerjaan ini AKTIF (end_date kosong), maka jadikan Current Position
        if (is_null($this->end_date)) {
            $this->alumni()->update([
                'current_position' => $this->position, // Kolom baru
                'company_name'     => $this->company_name,
            ]);
        }
    }

    public function alumni()
    {
        return $this->belongsTo(Alumni::class);
    }
}