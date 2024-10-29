<?php

namespace App\Http\Controllers;

use App\Models\RecoveryCode;
use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $setting = Setting::where('user_id', $user->id)->first();
        $recoveryCode = RecoveryCode::where('user_id', $user->id)->first();

        return Inertia::render('Settings/Settings', [
            'isGoogleAuthEnabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is2FAEnabled' => $setting ? $setting->is_2fa_enabled : false,
            'webIcon' => $setting && $setting->web_icon ? Storage::url($setting->web_icon) : '',
            'webName' => $setting ? $setting->web_name : '',
            'logo' => $setting && $setting->logo ? Storage::url($setting->logo) : '',
            'isGoogle2FAEnabled' => $setting ? $setting->is_google2fa_enabled : false,
            'recoveryCode' => $recoveryCode ? $recoveryCode->code : null,
            'isCodeCopied' => $recoveryCode ? $recoveryCode->is_code_copied : false,
            'isDarkModeEnabled' => $setting ? $setting->is_dark_mode_enabled : false, // Added dark mode setting
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $setting = Setting::firstOrCreate(['user_id' => $user->id]);

        if ($request->has('is_google_auth_enabled')) {
            $request->validate([
                'is_google_auth_enabled' => 'required|boolean',
            ]);
            $setting->update([
                'is_google_auth_enabled' => $request->is_google_auth_enabled,
            ]);
        }

        if ($request->has('is_2fa_enabled')) {
            $request->validate([
                'is_2fa_enabled' => 'required|boolean',
            ]);
            $setting->update([
                'is_2fa_enabled' => $request->is_2fa_enabled,
            ]);
        }

        if ($request->has('is_google2fa_enabled')) {
            $request->validate([
                'is_google2fa_enabled' => 'required|boolean',
            ]);

            $recoveryCode = RecoveryCode::where('user_id', $user->id)->first();
            if (!$recoveryCode || !$recoveryCode->is_code_copied) {
                return response()->json(['message' => 'You must generate and copy a recovery code before enabling Google 2FA'], 401);
            }

            $setting->update([
                'is_google2fa_enabled' => $request->is_google2fa_enabled,
            ]);
        }

        if ($request->has('is_dark_mode_enabled')) {
            $request->validate([
                'is_dark_mode_enabled' => 'required|boolean',
            ]);
            $setting->update([
                'is_dark_mode_enabled' => $request->is_dark_mode_enabled,
            ]);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function updateWebIconAndName(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'web_icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'web_name' => 'required|string',
        ]);

        $setting = Setting::firstOrCreate(['user_id' => $user->id]);

        if ($request->hasFile('web_icon')) {
            if ($setting->web_icon) {
                Storage::disk('public')->delete($setting->web_icon);
            }

            $file = $request->file('web_icon');
            $filePath = $file->store('web_icons', 'public');
            $setting->web_icon = $filePath;
        }

        $setting->web_name = $request->web_name;
        $setting->save();

        return response()->json(['message' => 'Web icon and name updated successfully']);
    }

    public function uploadLogo(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $setting = Setting::firstOrCreate(['user_id' => $user->id]);

        if ($request->hasFile('logo')) {
            if ($setting->logo) {
                Storage::disk('public')->delete($setting->logo);
            }

            $file = $request->file('logo');
            $filePath = $file->store('logos', 'public');
            $setting->logo = $filePath;
            $setting->save();
        }

        return response()->json(['message' => 'Logo uploaded successfully']);
    }

    public function getSettings()
    {
        $user = auth()->user();
        $setting = Setting::where('user_id', $user->id)->first();
        return response()->json([
            'is_google_auth_enabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is_2fa_enabled' => $setting ? $setting->is_2fa_enabled : false,
            'web_icon' => $setting && $setting->web_icon ? Storage::url($setting->web_icon) : '',
            'web_name' => $setting ? $setting->web_name : '',
            'logo' => $setting && $setting->logo ? Storage::url($setting->logo) : '',
            'is_google2fa_enabled' => $setting ? $setting->is_google2fa_enabled : false,
            'is_dark_mode_enabled' => $setting ? $setting->is_dark_mode_enabled : false,
        ]);
    }
}