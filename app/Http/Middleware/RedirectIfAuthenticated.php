<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                
                $user = Auth::user();
                
                // 1. Admin Redirect
                if ($user->role === 'admin') {
                    return redirect()->route('admin.dashboard');
                }

                // 2. Alumni Redirect -> Smart Root
                // This lets the controller decide if they need to do Setup first
                return redirect()->route('alumni.root');
            }
        }

        return $next($request);
    }
}