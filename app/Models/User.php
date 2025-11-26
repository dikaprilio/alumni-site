<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'has_seen_tour',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function alumni()
    {
        return $this->hasOne(Alumni::class);
    }

    public function news()
    {
        return $this->hasMany(News::class);
    }

    // Relasi: User (Admin) bisa membuat banyak Event
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        // Gunakan dispatch()->afterResponse() agar user tidak perlu menunggu email terkirim
        // sebelum redirect ke halaman berikutnya.
        $user = $this;
        dispatch(function () use ($user) {
            $user->notify(new \App\Notifications\CustomVerifyEmail);
        })->afterResponse();
    }
}