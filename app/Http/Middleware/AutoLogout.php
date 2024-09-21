<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AutoLogout
{
    public function handle($request, Closure $next, $guard = null)
    {
        // Check if the user is authenticated
        if (Auth::guard($guard)->check()) {
            $inactivityTimeout = config('app.inactivity_timeout', 300); // Timeout in seconds

            $lastActivity = Session::get('last_activity');

            // Check if last activity time is set and calculate the time difference
            if ($lastActivity && (time() - $lastActivity > $inactivityTimeout)) {
                Auth::guard($guard)->logout();
                Session::invalidate();
                return redirect()->route('login');
            }
        }

        // Update last activity time
        Session::put('last_activity', time());

        return $next($request);
    }
}