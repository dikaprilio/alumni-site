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
                
                // 1. Admin Redirect (Keep logic: Go to Admin Dashboard)
                if ($user->role === 'admin') {
                    return redirect(route('admin.dashboard'));
                }

                // 2. Alumni Redirect (FIX: Go to Landing Page '/')
                // Previously: return redirect(route('alumni.home'));
                // Now: Redirect to landing page so they see the "Profile" button in the header
                return redirect('/');
            }
        }

        return $next($request);
    }
}