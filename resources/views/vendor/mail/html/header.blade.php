@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block; text-decoration: none; color: #ffffff;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
@else
<span style="font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">{!! $slot !!}</span>
@endif
</a>
</td>
</tr>
