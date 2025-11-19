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
                'user' => $request->user(),
            ],

            // 2. Share Ziggy Routes
            'ziggy' => fn () => array_merge(
                (new Ziggy)->toArray(),
                ['location' => $request->url()]
            ),

            // 3. Flash Messages
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
