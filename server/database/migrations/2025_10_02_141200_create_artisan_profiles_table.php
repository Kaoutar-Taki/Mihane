<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('artisan_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('profession_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('title_ar', 200);
            $table->string('title_fr', 200)->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_fr')->nullable();
            $table->json('gallery')->nullable();
            $table->json('social')->nullable();
            $table->json('availability')->nullable();
            $table->string('address_ar', 255)->nullable();
            $table->string('address_fr', 255)->nullable();
            $table->enum('visibility', ['PUBLIC', 'PRIVATE'])->default('PUBLIC');
            $table->enum('verify_status', ['PENDING', 'VERIFIED', 'REJECTED'])->default('PENDING');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('profession_id')->references('id')->on('professions')->nullOnDelete();
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artisan_profiles');
    }
};
