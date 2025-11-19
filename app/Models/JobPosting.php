<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'company_name',
        'location',
        'job_type',
        'description',
        'salary_range',
        'application_url',
        'closing_date',
        'status',
        'image',
    ];

    protected $casts = [
        'closing_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}