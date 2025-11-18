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
        'start_year',
        'end_year',
        'description'
    ];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class);
    }
}