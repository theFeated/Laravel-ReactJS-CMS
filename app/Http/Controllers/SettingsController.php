<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $setting = Setting::first();
        return Inertia::render('Settings/Settings', [
            'isGoogleAuthEnabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is2FAEnabled' => $setting ? $setting->is_2fa_enabled : false,
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
    

    public function getSettings()
    {
        $setting = Setting::first();
        return response()->json([
            'is_google_auth_enabled' => $setting ? $setting->is_google_auth_enabled : false,
            'is_2fa_enabled' => $setting ? $setting->is_2fa_enabled : false,
        ]);
    }
}