<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecoveryCode extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'used',
        'used_at',
        'is_code_copied',
    ];

    protected $casts = [
        'used' => 'boolean',
        'used_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}