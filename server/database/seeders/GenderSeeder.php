<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class GenderSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $rows = [
            ['key' => 'male',   'name_ar' => 'ذكر',  'name_fr' => 'Homme'],
            ['key' => 'female', 'name_ar' => 'أنثى', 'name_fr' => 'Femme'],
        ];

        foreach ($rows as &$r) {
            $r['created_at'] = $now;
            $r['updated_at'] = $now;
        }
        unset($r);

        DB::table('genders')->upsert($rows, ['key'], ['name_ar','name_fr','updated_at']);
    }
}
