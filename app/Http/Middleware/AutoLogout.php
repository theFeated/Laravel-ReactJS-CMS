<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AutoLogout
{
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->check()) {
            $inactivityTimeout = config('app.inactivity_timeout', 300); // Timeout in seconds

            $lastActivity = Session::get('last_activity');

            if ($lastActivity && (time() - $lastActivity > $inactivityTimeout)) {
                $user = Auth::guard($guard)->user();

                if ($user) {
                    $user->two_factor_code = null;
                    $user->two_factor_sent_at = null;
                    $user->save();
                }

                Auth::guard($guard)->logout();
                Session::invalidate();
                return redirect()->route('login')->with('message', 'You have been logged out due to inactivity.');
            }
        }

        Session::put('last_activity', time());

        return $next($request);
    }
}