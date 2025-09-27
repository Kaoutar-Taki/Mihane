<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('genders', function (Blueprint $table) {
            $table->id();
            $table->string('key', 20)->unique(); 
            $table->string('name_ar', 50);
            $table->string('name', 50)->nullable();
            $table->timestamps();
        });

        DB::table('genders')->insert([
            ['key' => 'MALE', 'name_ar' => 'ذكر', 'name' => 'Homme', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'FEMALE', 'name_ar' => 'أنثى', 'name' => 'Femme', 'created_at' => now(), 'updated_at' => now()],
        ]);

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'name_ar')) {
                $table->string('name_ar', 255)->nullable()->after('name');
            }
            if (!Schema::hasColumn('users', 'bio_ar')) {
                $table->text('bio_ar')->nullable()->after('bio');
            }
            if (!Schema::hasColumn('users', 'gender_id')) {
                $table->foreignId('gender_id')->nullable()->after('avatar')->constrained('genders')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'gender_id')) {
                $table->dropConstrainedForeignId('gender_id');
            }
            if (Schema::hasColumn('users', 'bio_ar')) {
                $table->dropColumn('bio_ar');
            }
            if (Schema::hasColumn('users', 'name_ar')) {
                $table->dropColumn('name_ar');
            }
        });
        Schema::dropIfExists('genders');
    }
};
