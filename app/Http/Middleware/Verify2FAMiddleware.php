<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class Verify2FAMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $setting = Setting::first();

        $is2FAEnabledGlobally = $setting ? $setting->is_google2fa_enabled : false;

        if ($is2FAEnabledGlobally && $user && $user->google2fa_enabled && !session('2fa_verified')) {
            session(['url.intended' => $request->url()]);
            
            return redirect()->route('2fa.verify');
        }

        return $next($request);
    }
}