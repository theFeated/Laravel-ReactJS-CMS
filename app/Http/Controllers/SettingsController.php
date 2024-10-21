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
            'webIcon' => $setting && $setting->web_icon ? Storage::url($setting->web_icon) : '',
            'webName' => $setting ? $setting->web_name : '',
            'logo' => $setting && $setting->logo ? Storage::url($setting->logo) : '',
        ]);
    }

    public function update(Request $request)
    {
        // Fetch the first settings record or create a new one if it doesn't exist
        $setting = Setting::firstOrCreate([]);
    
        // Check if the request contains the `is_google_auth_enabled` field and validate it
        if ($request->has('is_google_auth_enabled')) {
            $request->validate([
                'is_google_auth_enabled' => 'required|boolean',
            ]);
            // Update only the Google Auth setting
            $setting->update([
                'is_google_auth_enabled' => $request->is_google_auth_enabled,
            ]);
        }
    
        // Check if the request contains the `is_2fa_enabled` field and validate it
        if ($request->has('is_2fa_enabled')) {
            $request->validate([
                'is_2fa_enabled' => 'required|boolean',
            ]);
            // Update only the 2FA setting
            $setting->update([
                'is_2fa_enabled' => $request->is_2fa_enabled,
            ]);
        }
    
        return response()->json(['message' => 'Settings updated successfully']);
    }
    
    public function updateWebIconAndName(Request $request)
    {
        $request->validate([
            'web_icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'web_name' => 'required|string',
        ]);

        $setting = Setting::firstOrCreate([]);

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
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $setting = Setting::firstOrCreate([]);

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
        $setting = Setting::first();
        return response()->json([
            'is_google_auth_enabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is_2fa_enabled' => $setting ? $setting->is_2fa_enabled : false,
            'web_icon' => $setting && $setting->web_icon ? Storage::url($setting->web_icon) : '',
            'web_name' => $setting ? $setting->web_name : '',
            'logo' => $setting && $setting->logo ? Storage::url($setting->logo) : '',
        ]);
    }
}