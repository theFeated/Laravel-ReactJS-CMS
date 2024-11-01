<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use Inertia\Inertia;
use PragmaRX\Google2FAQRCode\Google2FA;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class Google2FAController extends Controller
{

    // public function show2FASetup()
    // {
    //     $user = Auth::user();
    
    //     if (!$user) {
    //         return redirect()->route('login');
    //     }
    
    //     $settings = \DB::table('settings')->first();
    //     if (!$settings->is_google2fa_enabled) {
    //         return redirect()->route('dashboard')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
    //     }
    
    //     $google2fa = new Google2FA();
        
    //     // If 2FA is already enabled, use the existing secret
    //     if ($user->google2fa_enabled) {
    //         $secret = $user->google2fa_secret;
    //     } else {
    //         $secret = $google2fa->generateSecretKey();
    //         // Store the secret in the session instead of the database
    //         session(['temp_2fa_secret' => $secret]);
    //     }
    
    //     // Generate QR code URL
    //     $qrCodeUrl = $google2fa->getQRCodeUrl(
    //         'Overkill Security',
    //         $user->email,
    //         $secret
    //     );
    
    //     // Generate QR code SVG
    //     $renderer = new ImageRenderer(
    //         new RendererStyle(400),
    //         new SvgImageBackEnd()
    //     );
    //     $writer = new Writer($renderer);
    //     $qrCodeSvg = $writer->writeString($qrCodeUrl);
    
    //     return Inertia::render('Google2FA/Partials/Google2FASetup', [
    //         'secret' => $secret,
    //         'email' => $user->email,
    //         'qrCodeSvg' => $qrCodeSvg,
    //     ]);
    // }

    public function show2FASetup()
    {
        $user = Auth::user();
    
        if (!$user) {
            return redirect()->route('login');
        }
    
        $settings = \DB::table('settings')->first();
        if (!$settings->is_google2fa_enabled) {
            return redirect()->route('dashboard')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
        }
    
        $google2fa = new Google2FA();
        
        // Use the existing secret from the database
        $secret = $user->google2fa_secret;
    
        // If the secret doesn't exist or 2FA is not enabled, generate a new one
        // Set the user's secret key and enable 2FA. If not, an error will occur.
        //This error arises because the system checks the length against an empty 
        //database, as the secret key must pass OTP validation before being saved.
        //Secret key is too short. Must be at least 16 base32 characters. 
        //This error is kind of misleading.
        //It's not short because it's actually checking an empty google2fa_secret, an actual nothing.
        if (!$secret || !$user->google2fa_enabled) {
            $secret = $google2fa->generateSecretKey();
            $user->google2fa_secret = $secret;
            $user->google2fa_enabled = true;
            $user->save();
        }
    
        // Generate QR code URL
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            'Overkill Security',
            $user->email,
            $secret
        );
    
        // Generate QR code SVG
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($qrCodeUrl);
    
        return Inertia::render('Google2FA/Partials/Google2FASetup', [
            'secret' => $secret,
            'email' => $user->email,
            'qrCodeSvg' => $qrCodeSvg,
            'isEnabled' => $user->google2fa_enabled,
        ]);
    }
    
    public function setup2FA(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);
    
        $user = Auth::user();
        $secret = session('temp_2fa_secret');
    
        if (!$secret) {
            return back()->withErrors(['code' => 'Secret key not found. Please try setting up 2FA again.']);
        }
    
        $settings = \DB::table('settings')->first();
        if (!$settings->is_google2fa_enabled) {
            return redirect()->route('home')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
        }
    
        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($secret, $request->input('code'), 2);  // 2 * 30 second window
    
        if ($valid) {
            $user->google2fa_secret = $secret;
            $user->google2fa_enabled = true;
            $user->save();
    
            session(['2fa_verified' => true]);
            session()->forget('temp_2fa_secret');
    
            return redirect()->intended('/')->with('success', '2FA has been successfully enabled.');
        }
    
        return back()->withErrors(['code' => 'Invalid 2FA code. Please try again.']);
    }

    public function show2FAVerify()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $settings = \DB::table('settings')->first();
        if (!$settings->is_google2fa_enabled) {
            return redirect()->route('dashboard')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
        }

        if (!$user->google2fa_enabled) {
            return redirect()->route('dashboard')->withErrors(['2fa' => 'Google 2FA is not enabled for your account.']);
        }

        return Inertia::render('Google2FA/Partials/Google2FAVerify');
    }

    public function verify2FA(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);
    
        $user = Auth::user();

        $settings = \DB::table('settings')->first();
        if (!$settings->is_google2fa_enabled) {
            return redirect()->route('home')->withErrors(['2fa' => 'Google 2FA is not enabled.']);
        }
    
        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->input('code'), 2);  // 2 * 30 second window
    
        if ($valid) {
            session(['2fa_verified' => true]);
            return redirect()->intended('/dashboard')->with('success', '2FA verification successful.');
        }
    
        return back()->withErrors(['code' => 'Invalid 2FA code. Please try again.']);
    }
}