<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $notifications = Auth::user()
                ->notifications()
                ->orderBy('created_at', 'desc')
                ->get(); // Use get() instead of paginate() for simplicity

            return response()->json([
                'history' => $notifications,
                'unread_count' => Auth::user()->notifications()->whereNull('read_at')->count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch notifications', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->update(['read_at' => now()]);
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead()
    {
        Auth::user()
            ->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function store(Request $request)
    {
        // Simple validation
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'message' => 'required|string',
        ]);

        // Check if notifications are enabled for the user
        $settings = NotificationSettings::where('user_id', $validatedData['user_id'])->first();
        if ($settings && !$settings->is_notification_enabled) {
            return response()->json(['message' => 'Notifications are disabled for this user'], 403);
        }

        // Direct creation without try-catch
        $notification = Notification::create([
            'user_id' => $validatedData['user_id'],
            'type' => $validatedData['type'],
            'message' => $validatedData['message'],
            'read_at' => null
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification
        ], 201);
    }

    /**
     * Create multiple notifications at once
     */
    public function storeBatch(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'notifications' => 'required|array',
                'notifications.*.user_id' => 'required|exists:users,id',
                'notifications.*.type' => 'required|string|in:success,error,warning,info',
                'notifications.*.message' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $notifications = collect($request->notifications)->map(function ($item) {
                // Check if notifications are enabled for the user
                $settings = NotificationSettings::where('user_id', $item['user_id'])->first();
                if ($settings && !$settings->is_notification_enabled) {
                    return null;
                }

                return Notification::create([
                    'user_id' => $item['user_id'],
                    'type' => $item['type'],
                    'message' => $item['message'],
                    'read_at' => null
                ]);
            })->filter();

            return response()->json([
                'message' => 'Notifications created successfully',
                'notifications' => $notifications
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to create a notification programmatically
     */
    public static function createNotification($userId, $type, $message)
    {
        try {
            // Check if notifications are enabled for the user
            $settings = NotificationSettings::where('user_id', $userId)->first();
            if ($settings && !$settings->is_notification_enabled) {
                return null;
            }

            $notification = Notification::create([
                'user_id' => $userId,
                'type' => $type,
                'message' => $message,
                'read_at' => null
            ]);

            return $notification;

        } catch (\Exception $e) {
            \Log::error('Failed to create notification: ' . $e->getMessage());
            return null;
        }
    }
}