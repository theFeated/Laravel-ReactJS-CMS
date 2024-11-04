<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Setting;
use App\Models\NotificationSettings;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Models\Notification;

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
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                return $this->handleExistingUser($user, $googleUser);
            } else {
                return $this->handleNewUser($googleUser);
            }
        } catch (\Exception $e) {
            return redirect()->route('login')->with('notification', [
                'message' => 'Unable to login. Please try again.',
                'type' => 'error',
            ]);
        }
    }

    private function handleExistingUser(User $user, $googleUser)
    {
        try {
            DB::beginTransaction();

            $user->update([
                'userphoto' => $user->userphoto ?: null,
                'google_id' => $user->google_id ?: $googleUser->getId(),
            ]);

            // Check if Google authentication is enabled for the user
            $setting = Setting::where('user_id', $user->id)->first();
            if (!$setting || $setting->is_google_auth_enabled == 0) {
                DB::rollBack();
                return redirect()->route('login')->with('notification', [
                    'message' => 'Google authentication is not enabled for your account.',
                    'type' => 'error',
                ]);
            }

            Auth::login($user);

            // Save login notification to history
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Logged in successfully via Google.',
                'type' => 'success'
            ]);

            DB::commit();

            return redirect()->route('dashboard')->with('notification', [
                'message' => 'Welcome back, ' . $user->name . '! We are glad to see you again.',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('login')->with('notification', [
                'message' => 'An error occurred during login. Please try again.',
                'type' => 'error',
            ]);
        }
    }

    private function handleNewUser($googleUser)
    {
        try {
            DB::beginTransaction();

            // Create new user
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'userphoto' => null,
                'google_id' => $googleUser->getId(),
                'email_verified_at' => now(),
                'password' => bcrypt('1234'),
            ]);

            // Create and enable Google authentication setting
            Setting::create([
                'user_id' => $user->id,
                'is_google_auth_enabled' => 1,
                'is_2fa_enabled' => false,
                'is_google2fa_enabled' => false,
            ]);

            // Create default notification settings
            NotificationSettings::create([
                'user_id' => $user->id,
                'is_notification_enabled' => true,
                'display_duration' => 3000,
                'progress_step' => 3,
                'max_notifications' => 3
            ]);

            Auth::login($user);

            // Save registration notification to history
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Account created and logged in successfully via Google.',
                'type' => 'success'
            ]);

            DB::commit();

            return redirect()->route('dashboard')->with('notification', [
                'message' => 'Successfully registered! Your default password is 1234',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('login')->with('notification', [
                'message' => 'Registration failed. Please try again.',
                'type' => 'error',
            ]);
        }
    }
}