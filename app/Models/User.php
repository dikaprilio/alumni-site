<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // <--- PENTING: Tambahkan ini biar bisa set Admin/Alumni
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relasi: User (Alumni) punya satu data profil detail
    public function alumni()
    {
        return $this->hasOne(Alumni::class);
    }

    // Relasi: Admin bisa menulis banyak Berita
    public function news()
    {
        return $this->hasMany(News::class);
    }
}