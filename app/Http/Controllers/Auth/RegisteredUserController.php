<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Models\NotificationSettings;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            DB::beginTransaction();

            // Check if user already exists
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                return redirect()->route('register')->with('notification', [
                    'message' => 'User already exists. Please log in.',
                    'type' => 'error',
                ]);
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Create default notification settings
            NotificationSettings::create([
                'user_id' => $user->id,
                'is_notification_enabled' => true,
                'display_duration' => 3000,
                'progress_step' => 3,
                'max_notifications' => 3
            ]);

            // Save registration notification to history
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Account created successfully.',
                'type' => 'success'
            ]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            return redirect()->route('dashboard')->with('notification', [
                'message' => 'Account created successfully. Welcome!',
                'type' => 'success',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('register')->with('notification', [
                'message' => 'Registration failed. Please try again.',
                'type' => 'error',
            ]);
        }
    }
}