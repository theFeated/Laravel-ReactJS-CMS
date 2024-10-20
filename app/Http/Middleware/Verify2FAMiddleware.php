<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class Verify2FAMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Fetch the 2FA setting from the database
        $setting = Setting::first();

        // Check if 2FA is enabled
        $is2FAEnabled = $setting ? $setting->is_2fa_enabled : false;

        // Skip the 2FA check if it is disabled
        if ($is2FAEnabled && auth()->check() && !session('two_factor_authenticated')) {
            return redirect()->route('twofactor.index');
        }

        return $next($request);
    }
}