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
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'is_google_auth_enabled' => 'required|boolean',
        ]);

        // Fetch the first settings record or create a new one if it doesn't exist
        $setting = Setting::firstOrCreate([], [
            'is_google_auth_enabled' => $request->is_google_auth_enabled,
        ]);

        // Update the existing record
        $setting->update([
            'is_google_auth_enabled' => $request->is_google_auth_enabled,
        ]);

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function getSettings()
    {
        $setting = Setting::first();
        return response()->json([
            'is_google_auth_enabled' => $setting ? $setting->is_google_auth_enabled : false,
        ]);
    }

}
