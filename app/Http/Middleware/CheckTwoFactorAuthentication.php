<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class CheckTwoFactorAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $settings = Setting::first();
        
        // Only check for 2FA if it's enabled in settings
        if ($settings && $settings->is_2fa_enabled) {
            if (auth()->check() && !session('two_factor_authenticated')) {
                return redirect()->route('twofactor.index');
            }
        }

        return $next($request);
    }
}