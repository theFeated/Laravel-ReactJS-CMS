<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

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
            $request->authenticate();

            $request->session()->regenerate();
            $user = Auth::user();
            if (!$user instanceof User) {
                throw new \Exception('Authenticated user is not an instance of User model.');
            }
            $user = Auth::user();
            
            // Create welcome message
            $message = 'Welcome back, ' . $user->name . '! We are glad to see you again.';
            
            // Add notification to session
            $request->session()->put('notification', [
                'message' => $message,
                'type' => 'success',
            ]);

            // Save to notification history
            Notification::create([
                'user_id' => $user->id,
                'message' => $message,
                'type' => 'success'
            ]);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (ValidationException $e) {
            // Add failure notification to session
            $request->session()->put('notification', [
                'message' => 'Login failed. Please check your credentials and try again.',
                'type' => 'error',
            ]);

            return redirect()->route('login')->withErrors($e->errors());
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