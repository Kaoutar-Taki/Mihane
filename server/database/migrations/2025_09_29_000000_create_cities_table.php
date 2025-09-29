<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_fr');

            $table->foreignId('region_id')
                  ->constrained('regions')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            $table->unique(['name_ar', 'region_id']);
            $table->unique(['name_fr', 'region_id']);
            $table->index('region_id');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
