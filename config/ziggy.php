<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Only Include Specific Routes
    |--------------------------------------------------------------------------
    |
    | Define patterns for routes that should be exposed to the frontend.
    | This is a security measure to prevent exposing sensitive admin routes.
    |
    */
    'only' => [
        'public.*',
        'alumni.*',
        'login',
        'logout',
        'register',
        'password.*',
        'verification.*',
        'user.*',
        'opportunities',
        'opportunities.*',
        'home',
        'news.*',
        'events.*',
        'community.*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Exclude Specific Routes
    |--------------------------------------------------------------------------
    |
    | Define patterns for routes that should NOT be exposed to the frontend.
    | These routes will be excluded even if they match the 'only' patterns.
    |
    */
    'except' => [
        'admin.*',
        'horizon.*',
        'telescope.*',
        'ignition.*',
        'sanctum.*',
        '_debugbar.*',
    ],
];
