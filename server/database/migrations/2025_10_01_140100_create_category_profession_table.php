<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('category_profession', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('profession_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('profession_id')->references('id')->on('professions')->onDelete('cascade');
            $table->primary(['category_id', 'profession_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_profession');
    }
};
