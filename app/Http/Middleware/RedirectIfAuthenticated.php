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
                
                // INI ADALAH LOGIKA PENTINGNYA
                $user = Auth::user();
                
                if ($user->role === 'admin') {
                    // Jika admin, lempar ke dashboard admin
                    return redirect(route('admin.dashboard'));
                }

                // Jika alumni, lempar ke beranda alumni
                return redirect(route('alumni.home'));
            }
        }

        return $next($request);
    }
}