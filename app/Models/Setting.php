<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'is_google_auth_enabled',
        'is_2fa_enabled',
        'web_icon',
        'web_name',
        'logo',
        'is_google2fa_enabled'
    ];
}