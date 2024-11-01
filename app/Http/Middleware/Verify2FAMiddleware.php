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

        if ($is2FAEnabledGlobally && $user) {
            // Check if the user's 2FA settings are not set
            if (!$user->google2fa_secret || !$user->google2fa_enabled) {
                session(['url.intended' => $request->url()]);
                return redirect()->route('2fa.setup');
            }

            // Check if the user needs to verify 2FA
            if ($user->google2fa_enabled && !session('2fa_verified')) {

                // Check if is_2fa_enabled is true in the user's settings
                $userSetting = Setting::where('user_id', $user->id)->first();
                if ($userSetting && $userSetting->is_2fa_enabled) {
                    // Notify the user that they are going to pass through email OTP verification security
                    return redirect()->route('2fa.verify')->with('notification', [
                        'message' => 'You are going to pass through email OTP verification security next.',
                        'type' => 'error', // Set the notification type to 'error' for red color
                        'displayDuration' => 10000, // Set the display duration to 10 seconds
                    ]);
                }
                session(['url.intended' => $request->url()]);
                return redirect()->route('2fa.verify');
            }
        }

        return $next($request);
    }
}