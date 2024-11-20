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
            'webIcon' => $setting && $setting->set_web_icon ? Storage::url($setting->set_web_icon) : '',
            'webName' => $setting ? $setting->set_web_name : '',
            'set_logo' => $setting && $setting->set_logo ? Storage::url($setting->set_logo) : '',
            'isGoogle2FAEnabled' => $setting ? $setting->is_google2fa_enabled : false,
            'recoveryCode' => $recoveryCode ? $recoveryCode->code : null,
            'isCodeCopied' => $recoveryCode ? $recoveryCode->is_code_copied : false,
            'isDarkModeEnabled' => $setting ? $setting->is_dark_mode_enabled : false,
            'isCaptchaSliderEnabled' => $setting ? $setting->is_captcha_slider_enabled : false,
            'isStandardLoginEnabled' => $setting ? $setting->is_standard_login_enabled : false,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $setting = Setting::firstOrCreate(['user_id' => $user->id]);

        $isGoogleAuthEnabled = $request->has('is_google_auth_enabled')
            ? $request->is_google_auth_enabled
            : $setting->is_google_auth_enabled;

        $isStandardLoginEnabled = $request->has('is_standard_login_enabled')
            ? $request->is_standard_login_enabled
            : $setting->is_standard_login_enabled;

        if (!$isGoogleAuthEnabled && !$isStandardLoginEnabled) {
            return response()->json([
                'message' => 'You must keep at least one login method enabled.',
            ], 400);
        }

        // Proceed with individual setting updates
        if ($request->has('is_google_auth_enabled')) {
            $request->validate([
                'is_google_auth_enabled' => 'required|boolean',
            ]);
            $setting->update([
                'is_google_auth_enabled' => $request->is_google_auth_enabled,
            ]);
        }

        if ($request->has('is_standard_login_enabled')) {
            $request->validate([
                'is_standard_login_enabled' => 'required|boolean',
            ]);
            $setting->update([
                'is_standard_login_enabled' => $request->is_standard_login_enabled,
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

        if ($request->has('is_captcha_slider_enabled')) {
            $request->validate([
                'is_captcha_slider_enabled' => 'required|boolean',
            ]);
            $setting->update([
                'is_captcha_slider_enabled' => $request->is_captcha_slider_enabled,
            ]);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function updateWebIconAndName(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'set_web_icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'set_web_name' => 'required|string',
        ]);

        $setting = Setting::firstOrCreate(['user_id' => $user->id]);

        if ($request->hasFile('set_web_icon')) {
            if ($setting->set_web_icon) {
                Storage::disk('public')->delete($setting->set_web_icon);
            }

            $file = $request->file('set_web_icon');
            $filePath = $file->store('web_icons', 'public');
            $setting->set_web_icon = $filePath;
        }

        $setting->set_web_name = $request->set_web_name;
        $setting->save();

        return response()->json(['message' => 'Web icon and name updated successfully']);
    }

    public function uploadLogo(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'set_logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $setting = Setting::firstOrCreate(['user_id' => $user->id]);

        if ($request->hasFile('set_logo')) {
            if ($setting->set_logo) {
                Storage::disk('public')->delete($setting->set_logo);
            }

            $file = $request->file('set_logo');
            $filePath = $file->store('logos', 'public');
            $setting->set_logo = $filePath;
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
            'set_web_icon' => $setting && $setting->set_web_icon ? Storage::url($setting->set_web_icon) : '',
            'set_web_name' => $setting ? $setting->set_web_name : '',
            'set_logo' => $setting && $setting->set_logo ? Storage::url($setting->set_logo) : '',
            'is_google2fa_enabled' => $setting ? $setting->is_google2fa_enabled : false,
            'is_dark_mode_enabled' => $setting ? $setting->is_dark_mode_enabled : false,
            'is_captcha_slider_enabled' => $setting ? $setting->is_captcha_slider_enabled : false,
            'is_standard_login_enabled' => $setting ? $setting->is_standard_login_enabled : false,
        ]);
    }
}
