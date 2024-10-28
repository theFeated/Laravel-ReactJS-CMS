<?php

namespace App\Http\Controllers;

use App\Models\NotificationSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationSettingsController extends Controller
{
    public function index()
    {
        $settings = Auth::user()->notificationSettings;
        
        // If no settings exist, create default settings
        if (!$settings) {
            $settings = NotificationSettings::create([
                'user_id' => Auth::id(),
                'is_notification_enabled' => true,
                'display_duration' => 3000,
                'progress_step' => 3,
                'max_notifications' => 3,
            ]);
        }
        
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'is_notification_enabled' => 'sometimes|boolean',
            'display_duration' => 'sometimes|integer|min:1000',
            'progress_step' => 'sometimes|integer|min:1|max:100',
            'max_notifications' => 'sometimes|integer|min:1'
        ]);

        $settings = Auth::user()->notificationSettings;

        // If no settings exist, create new settings
        if (!$settings) {
            $settings = new NotificationSettings([
                'user_id' => Auth::id(),
                'is_notification_enabled' => true,
                'display_duration' => 3000,
                'progress_step' => 3,
                'max_notifications' => 3,
            ]);
        }

        // Update only the provided fields
        foreach ($validatedData as $key => $value) {
            $settings->$key = $value;
        }

        $settings->save();

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $settings->fresh()
        ]);
    }
}