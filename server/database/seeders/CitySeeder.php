<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name_ar'=>'الدار البيضاء','name_fr'=>'Casablanca','region_id'=>6],
            ['name_ar'=>'سطات','name_fr'=>'Settat','region_id'=>6],
            ['name_ar'=>'الرباط','name_fr'=>'Rabat','region_id'=>4],
            ['name_ar'=>'القنيطرة','name_fr'=>'Kénitra','region_id'=>4],
            ['name_ar'=>'فاس','name_fr'=>'Fès','region_id'=>3],
            ['name_ar'=>'مكناس','name_fr'=>'Meknès','region_id'=>3],
            ['name_ar'=>'طنجة','name_fr'=>'Tanger','region_id'=>1],
            ['name_ar'=>'تطوان','name_fr'=>'Tétouan','region_id'=>1],
            ['name_ar'=>'مراكش','name_fr'=>'Marrakech','region_id'=>7],
            ['name_ar'=>'آسفي','name_fr'=>'Safi','region_id'=>7],
            ['name_ar'=>'أكادير','name_fr'=>'Agadir','region_id'=>9],
            ['name_ar'=>'وجدة','name_fr'=>'Oujda','region_id'=>2],
            ['name_ar'=>'العيون','name_fr'=>'Laâyoune','region_id'=>11],
            ['name_ar'=>'الداخلة','name_fr'=>'Dakhla','region_id'=>12],
            ['name_ar'=>'الرشيدية','name_fr'=>'Errachidia','region_id'=>8],
            ['name_ar'=>'بني ملال','name_fr'=>'Béni Mellal','region_id'=>5],
        ];

        foreach ($data as $row) {
            City::updateOrCreate([
                'name_ar' => $row['name_ar'],
                'region_id' => $row['region_id'],
            ], [
                'name_fr' => $row['name_fr'],
            ]);
        }
    }
}
