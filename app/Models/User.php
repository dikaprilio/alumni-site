<?php

namespace App\Models;

// TAMBAHKAN INI:
use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// IMPLEMENTASIKAN MustVerifyEmail
class User extends Authenticatable implements MustVerifyEmail
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