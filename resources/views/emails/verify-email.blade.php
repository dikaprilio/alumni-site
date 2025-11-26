@component('mail::message')
# Halo, {{ $userName ?? 'Pengguna' }}!

Terima kasih telah mendaftar di **{{ config('app.name') }}**.

Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:

@component('mail::button', ['url' => $verificationUrl, 'color' => 'primary'])
Verifikasi Email
@endcomponent

Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:

{{ $verificationUrl }}

Jika Anda tidak membuat akun ini, tidak perlu melakukan tindakan apapun.

Salam,  
**Tim {{ config('app.name') }}**

---
<small style="color: #6b7280;">
© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
</small>
@endcomponent

