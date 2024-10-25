<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Setting;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class GoogleAuthController extends Controller
{
    private function disableGoogleCredentials()
    {
        Config::set('services.google.client_id', null);
        Config::set('services.google.client_secret', null);
        Config::set('services.google.redirect', null);
    }

    public function redirectToGoogle()
    {
        $setting = Setting::first();

        if (!$setting || $setting->is_google_auth_enabled == 0) {
            $this->disableGoogleCredentials();

            return redirect()->route('login');
        }

        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        $setting = Setting::first();

        if (!$setting || $setting->is_google_auth_enabled == 0) {
            $this->disableGoogleCredentials();

            return redirect()->route('login');
        }

        try {
            $googleUser  = Socialite::driver('google')->user();
            $user = User::where('email', $googleUser ->getEmail())->first();

            if ($user) {
                $user->update([
                    'userphoto' => $user->userphoto ?: null, 
                    'google_id' => $user->google_id ?: $googleUser ->getId(),
                ]);

                Auth::login($user);
                return redirect()->intended('dashboard');
            } else {
                $user = User::create([
                    'name' => $googleUser ->getName(),
                    'email' => $googleUser ->getEmail(),
                    'userphoto' => null, 
                    'google_id' => $googleUser ->getId(),
                    'email_verified_at' => now(),
                    'password' => bcrypt('1234'),
                ]);

                Auth::login($user);
                return redirect()->intended('dashboard');
            }
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['email' => 'Unable to login. Please try again.']);
        }
    }
}