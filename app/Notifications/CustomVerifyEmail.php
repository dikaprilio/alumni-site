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
            ->subject('✨ Verifikasi Email Anda - ' . $appName)
            ->greeting('Halo, ' . $userName . '! 👋')
            ->line('Terima kasih telah bergabung dengan **' . $appName . '**!')
            ->line('Kami senang Anda menjadi bagian dari komunitas alumni kami.')
            ->line('')
            ->line('Untuk menyelesaikan pendaftaran, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah:')
            ->action('✓ Verifikasi Email Saya', $verificationUrl)
            ->line('')
            ->line('**Troubleshooting:**')
            ->line('Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:')
            ->line($verificationUrl)
            ->line('')
            ->line('⚠️ Jika Anda tidak membuat akun ini, abaikan email ini.')
            ->salutation('Salam hangat, Tim ' . $appName);
    }
}
