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
            $table->boolean('is_google_auth_enabled')->default(true);
            $table->boolean('is_2fa_enabled')->default(false);
            $table->string('web_icon')->nullable();
            $table->string('web_name')->nullable();
            $table->string('logo')->nullable();
            $table->boolean('is_google2fa_enabled')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
}