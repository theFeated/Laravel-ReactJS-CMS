<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'userphoto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation rules for the image
        ]);
    
        $user = auth()->user();
    
        if ($request->hasFile('userphoto')) {
            $image = $request->file('userphoto');
            $imageName = 'img_' . time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('user_photos'), $imageName);
    
            // Delete the old photo if it exists
            if ($user->userphoto && file_exists(public_path('user_photos/' . $user->userphoto))) {
                unlink(public_path('user_photos/' . $user->userphoto));
            }
    
            $user->userphoto = $imageName;
            $user->save();
        }
    
        return redirect()->back()->with('success', 'Profile photo updated successfully');
    }
    
}
