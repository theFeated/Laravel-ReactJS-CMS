<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'user_id',
        'is_google_auth_enabled',
        'is_2fa_enabled',
        'set_web_icon',
        'set_web_name',
        'set_logo',
        'is_google2fa_enabled',
        'is_dark_mode_enabled',
        'is_captcha_slider_enabled',
        'is_standard_login_enabled',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}