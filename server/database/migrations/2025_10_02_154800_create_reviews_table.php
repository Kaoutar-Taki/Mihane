<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('profile_id'); 
            $table->unsignedBigInteger('user_id'); 
            $table->unsignedTinyInteger('rating'); 
            $table->text('comment');
            $table->enum('status', ['PENDING','APPROVED','REJECTED'])->default('PENDING');
            $table->enum('visibility', ['PUBLIC','PRIVATE'])->default('PUBLIC');
            $table->json('artisan_response')->nullable(); 
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('profile_id')->references('id')->on('artisan_profiles')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
