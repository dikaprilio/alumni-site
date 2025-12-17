<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Exclude Specific Routes (SECURITY)
    |--------------------------------------------------------------------------
    |
    | IMPORTANT: Using both 'only' AND 'except' together disables filtering!
    | We use ONLY 'except' to hide sensitive admin/debug routes from frontend.
    |
    | All routes will be exposed EXCEPT those matching these patterns.
    |
    */
    'except' => [
        'admin.*',
        'horizon.*',
        'telescope.*',
        'ignition.*',
        'sanctum.*',
        '_debugbar.*',
        'laravel-erd.*',
    ],
];
