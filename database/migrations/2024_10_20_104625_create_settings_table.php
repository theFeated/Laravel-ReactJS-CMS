<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_google_auth_enabled')->default(true);
            $table->boolean('is_2fa_enabled')->default(false);
            $table->string('set_web_icon')->nullable();
            $table->string('set_web_name')->nullable();
            $table->string('set_logo')->nullable();
            $table->boolean('is_google2fa_enabled')->default(false);
            $table->boolean('is_dark_mode_enabled')->default(false);
            $table->boolean('is_captcha_slider_enabled')->default(true);
            $table->boolean('is_standard_login_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
}