<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Notification;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            // Fetch user by email to check settings before authenticating
            $user = User::where('email', $request->email)->first();
    
            // Check if user exists and fetch settings
            if ($user) {
                $setting = Setting::where('user_id', $user->id)->first();
    
                // Log user settings fetching
                Log::info('User  settings fetched', [
                    'user_id' => $user->id,
                    'is_standard_login_enabled' => $setting ? $setting->is_standard_login_enabled : null,
                ]);
    
                // Check if Standard Login is disabled
                if ($setting && !$setting->is_standard_login_enabled) {
                    Log::warning('You disabled standard login. Try another way in.', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'manual_login_enabled' => $setting->is_standard_login_enabled,
                    ]);
    
                    // Set notification for Standard Login disabled
                    $request->session()->put('notification', [
                        'message' => 'You disabled standard login. Try another way in.',
                        'type' => 'error',
                    ]);
            
                    return redirect()->route('login');
                }
            }
    
            // Attempt to authenticate the user
            $request->authenticate();
    
            // Regenerate session
            $request->session()->regenerate();
            $user = Auth::user();
    
            // Log successful authentication
            Log::info('User  authenticated', ['user_id' => $user->id]);
    
            // Create welcome message
            $message = 'Welcome back, ' . $user->name . '! We are glad to see you again.';
    
            // Save login notification to history
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Logged in successfully via Standard Login.',
                'type' => 'success'
            ]);
    
            // Redirect to dashboard with welcome notification
            return redirect()->route('dashboard')->with('notification', [
                'message' => $message,
                'type' => 'success',
            ]);
    
        } catch (ValidationException $e) {
            // Add failure notification to session
            $request->session()->put('notification', [
                'message' => 'Login failed. Please check your credentials and try again.',
                'type' => 'error',
            ]);
    
            return redirect()->route('login')->withErrors($e->errors());
        } catch (\Exception $e) {
            // Log any unexpected errors
            Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return redirect()->route('login')->with('notification', [
                'message' => 'An unexpected error occurred. Please try again.',
                'type' => 'error',
            ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            // Save logout notification to history
            Notification::create([
                'user_id' => $user->id,
                'message' => 'You have been successfully logged out.',
                'type' => 'info'
            ]);

            $user->two_factor_code = null;
            $user->two_factor_sent_at = null;
            $user->save();
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}