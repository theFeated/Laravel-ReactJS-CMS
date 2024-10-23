<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class Ensure2FAEnabled
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $setting = Setting::first();

        if ($setting && $setting->is_google2fa_enabled && $user && !$user->google2fa_enabled && $request->path() != 'setup-2fa') {
            return redirect('/setup-2fa');
        }

        return $next($request);
    }
}