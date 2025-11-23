<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Alumni;

class Opportunity extends Model
{
    protected $fillable = [
        'alumni_id',
        'type',
        'title',
        'description',
        'company_name',
        'location',
        'contact_info',
        'status',
    ];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class);
    }
}
