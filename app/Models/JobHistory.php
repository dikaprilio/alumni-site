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
        'start_date',
        'end_date',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // LOGIKA 'booted' DIHAPUS KARENA SUDAH DINORMALISASI.
    // Tidak perlu lagi sync ke tabel alumni karena tabel alumni tidak menyimpan data pekerjaan lagi.

    public function alumni()
    {
        return $this->belongsTo(Alumni::class);
    }
}