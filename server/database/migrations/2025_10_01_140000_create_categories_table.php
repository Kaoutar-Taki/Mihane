<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar', 150);
            $table->string('name_fr', 150)->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_fr')->nullable();
            $table->string('icon', 16)->nullable();
            $table->string('color', 16)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
