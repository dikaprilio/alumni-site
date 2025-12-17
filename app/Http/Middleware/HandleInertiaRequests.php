<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            // 1. Share Auth Data
            'auth' => [
                // MODIFIED: Load relasi 'alumni' dengan semua relasi yang diperlukan untuk dashboard
                'user' => $request->user() ? $request->user()->load(['alumni.skills', 'alumni.jobHistories']) : null,
            ],

            // 2. Share Ziggy Routes (filtering configured in config/ziggy.php)
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // 3. Flash Messages
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'status' => fn () => $request->session()->get('status'),
            ],

            // 4. SEO Meta Data
            'seo' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'description' => 'Platform alumni Teknologi Rekayasa Perangkat Lunak IPB - Hubungkan dengan alumni, temukan peluang karir, dan berbagi pengalaman.',
                'keywords' => 'alumni IPB, Teknik Rekayasa Perangkat Lunak, TPL, tracer study, karir, networking, alumni network',
            ],
        ];
    }
}