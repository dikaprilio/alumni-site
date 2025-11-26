<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmail
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        $userName = $notifiable->name ?? 'Pengguna';
        $appName = config('app.name');

        return (new MailMessage)
            ->subject('Verifikasi Email Anda - ' . $appName)
            ->greeting('Halo, ' . $userName . '!')
            ->line('Terima kasih telah mendaftar di **' . $appName . '**.')
            ->line('Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:')
            ->action('Verifikasi Email', $verificationUrl)
            ->line('Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:')
            ->line($verificationUrl)
            ->line('Jika Anda tidak membuat akun ini, tidak perlu melakukan tindakan apapun.')
            ->salutation('Salam, Tim ' . $appName);
    }
}
