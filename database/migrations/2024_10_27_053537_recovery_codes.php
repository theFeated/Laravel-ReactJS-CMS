<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('recovery_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('code');
            $table->boolean('used')->default(false);
            $table->timestamp('used_at')->nullable();
            $table->boolean('is_code_copied')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('recovery_codes');
    }
};
