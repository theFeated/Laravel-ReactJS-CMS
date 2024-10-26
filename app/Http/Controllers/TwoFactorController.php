<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class TwoFactorController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user->two_factor_code || !$user->two_factor_sent_at) {
            $code = rand(100000, 999999);
            $user->two_factor_code = $code;
            $user->two_factor_sent_at = Carbon::now();
            $user->save();

            Mail::raw("Your two-factor authentication code is: $code", function ($message) use ($user) {
                $message->to($user->email)->subject('Two-Factor Code');
            });
        }

        return inertia('Auth/TwoFactor');
    }

    /**
     * Verify the two-factor authentication code provided by the user.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'two_factor_code' => 'required|string|size:6',
        ]);
    
        $user = Auth::user();
        $code = $request->two_factor_code;
    
        if ($code === $user->two_factor_code) {
            session(['two_factor_authenticated' => true]);
            return redirect()->intended('/dashboard');
        }
    
        return back()->withErrors(['two_factor_code' => 'The provided code is incorrect.']);
    }

    public function resend()
    {
        $user = Auth::user();
        
        // Generate new code
        $code = rand(100000, 999999);
        $user->two_factor_code = $code;
        $user->two_factor_sent_at = Carbon::now();
        $user->save();

        // Send new code via email
        Mail::raw("Your new two-factor authentication code is: $code", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('New Two-Factor Code');
        });

        return redirect()->back()->with('message', 'New verification code has been sent to your email.');
    }

}
