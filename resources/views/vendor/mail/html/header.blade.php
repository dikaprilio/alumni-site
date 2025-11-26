@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block; text-decoration: none; color: #1f2937;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
@else
<span style="font-size: 24px; font-weight: bold; color: #1f2937;">{!! $slot !!}</span>
@endif
</a>
</td>
</tr>
