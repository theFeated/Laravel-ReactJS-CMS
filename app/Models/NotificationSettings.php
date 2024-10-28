<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSettings extends Model
{
    protected $fillable = [
        'user_id',
        'is_notification_enabled',
        'display_duration',
        'progress_step',
        'max_notifications'
    ];

    protected $casts = [
        'is_notification_enabled' => 'boolean',
        'display_duration' => 'integer',
        'progress_step' => 'integer',
        'max_notifications' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}