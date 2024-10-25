<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use Inertia\Inertia;

class Google2FAController extends Controller
{
    // Show the 2FA setup screen
    public function show2FASetup()
    {
        $user = Auth::user();
    
        if (!$user) {
            return redirect()->route('login');
        }
    
        // Check if Google 2FA is enabled in settings
        $settings = \DB::table('settings')->first();
        if (!$settings->is_google2fa_enabled) {
            return redirect()->route('dashboard')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
        }
    
        // Generate a secret key for the user if they don't have one
        $secret = $user->createTwoFactorAuth();
    
        // Render the Inertia component and pass the secret key and email
        return Inertia::render('Google2FA/Partials/Google2FASetup', [
            'secret' => $secret,
            'email' => $user->email,
        ]);
    }

    // Show the 2FA verification screen
    public function show2FAVerify()
    {
        return Inertia::render('Google2FA/Partials/Google2FAVerify');
    }

    // Verify the 2FA code
    public function verify2FA(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric',
        ]);
    
        $user = Auth::user();
        $secret = $user->google2fa_secret;
    
        // Check if Google 2FA is enabled in settings
        $settings = \DB::table('settings')->first();
        if (!$settings->is_google2fa_enabled) {
            return redirect()->route('home')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
        }
    
        $google2fa = new \PragmaRX\Google2FAQRCode\Google2FA();
        $valid = $google2fa->verifyKey($secret, $request->input('code'));
    
        if ($valid) {
            // If the code is valid, enable 2FA for the user
            $user->google2fa_enabled = true;
            $user->save();
    
            session(['2fa_verified' => true]);
    
            return redirect()->intended('/');
        }
    
        return back()->withErrors(['code' => 'Invalid 2FA code.']);
    }

    public function complete2FASetup(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $user->google2fa_setup_complete = true;
        $user->save();

        return redirect()->route('verify-2fa');
    }
}