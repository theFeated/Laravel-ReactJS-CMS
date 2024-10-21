<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        $setting = Setting::first();
        return Inertia::render('Settings/Settings', [
            'isGoogleAuthEnabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is2FAEnabled' => $setting ? $setting->is_2fa_enabled : false,
            'webIcon' => $setting && $setting->web_icon ? Storage::url($setting->web_icon) : '',  // Ensure full URL is returned
            'webName' => $setting ? $setting->web_name : '',
        ]);
    }

    public function updateWebIconAndName(Request $request)
    {
        $request->validate([
            'web_icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'web_name' => 'required|string',
        ]);

        $setting = Setting::firstOrCreate([]);

        if ($request->hasFile('web_icon')) {
            // Delete the old icon if it exists
            if ($setting->web_icon) {
                Storage::disk('public')->delete($setting->web_icon);
            }

            // Store the new icon and save the path
            $file = $request->file('web_icon');
            $filePath = $file->store('web_icons', 'public');
            $setting->web_icon = $filePath;
        }

        $setting->web_name = $request->web_name;
        $setting->save();

        return response()->json(['message' => 'Web icon and name updated successfully']);
    }

    public function getSettings()
    {
        $setting = Setting::first();
        return response()->json([
            'is_google_auth_enabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is_2fa_enabled' => $setting ? $setting->is_2fa_enabled : false,
            'web_icon' => $setting && $setting->web_icon ? Storage::url($setting->web_icon) : '',  // Return full URL here as well
            'web_name' => $setting ? $setting->web_name : '',
        ]);
    }
}
