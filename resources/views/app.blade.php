<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Primary Meta Tags --}}
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="title" content="{{ config('app.name', 'Alumni Site') }} - Platform Alumni Teknik Pertanian IPB">
        <meta name="description" content="Platform alumni Teknik Pertanian IPB - Hubungkan dengan alumni, temukan peluang karir, dan berbagi pengalaman. Directory alumni, lowongan kerja, mentoring, dan berita terbaru.">
        <meta name="keywords" content="alumni IPB, Teknik Pertanian, TPL, tracer study, karir, networking, alumni network, lowongan kerja, mentoring">
        <meta name="author" content="{{ config('app.name') }}">
        <meta name="robots" content="index, follow">
        <meta name="language" content="Indonesian">
        <meta name="revisit-after" content="7 days">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ config('app.url') }}">
        <meta property="og:title" content="{{ config('app.name') }} - Platform Alumni Teknik Pertanian IPB">
        <meta property="og:description" content="Platform alumni Teknik Pertanian IPB - Hubungkan dengan alumni, temukan peluang karir, dan berbagi pengalaman.">
        <meta property="og:image" content="{{ asset('images/og-image.jpg') }}">
        <meta property="og:locale" content="id_ID">
        <meta property="og:site_name" content="{{ config('app.name') }}">

        {{-- Twitter --}}
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ config('app.url') }}">
        <meta property="twitter:title" content="{{ config('app.name') }} - Platform Alumni Teknik Pertanian IPB">
        <meta property="twitter:description" content="Platform alumni Teknik Pertanian IPB - Hubungkan dengan alumni, temukan peluang karir, dan berbagi pengalaman.">
        <meta property="twitter:image" content="{{ asset('images/og-image.jpg') }}">

        {{-- Favicon --}}
        <link rel="icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ config('app.url') }}{{ request()->path() }}">

        {{-- Structured Data (JSON-LD) --}}
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "{{ config('app.name') }}",
            "url": "{{ config('app.url') }}",
            "logo": "{{ config('app.url') }}/images/logo.png",
            "description": "Platform alumni Teknik Pertanian IPB - Hubungkan dengan alumni, temukan peluang karir, dan berbagi pengalaman.",
            "sameAs": [
                "https://tracerstudy.ipb.ac.id/"
            ]
        }
        </script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

        {{-- PENTING: @routes harus ada sebelum vite agar konfigurasi rute terbaca --}}
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>