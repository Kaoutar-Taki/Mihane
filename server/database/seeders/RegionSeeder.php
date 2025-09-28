<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id'=>1,'name_ar'=>'جهة طنجة تطوان الحسيمة','name_fr'=>'Tanger-Tétouan-Al Hoceïma'],
            ['id'=>2,'name_ar'=>'جهة الشرق','name_fr'=>"L'Oriental"],
            ['id'=>3,'name_ar'=>'جهة فاس مكناس','name_fr'=>'Fès-Meknès'],
            ['id'=>4,'name_ar'=>'جهة الرباط سلا القنيطرة','name_fr'=>'Rabat-Salé-Kénitra'],
            ['id'=>5,'name_ar'=>'جهة بني ملال خنيفرة','name_fr'=>'Béni Mellal-Khénifra'],
            ['id'=>6,'name_ar'=>'جهة الدار البيضاء سطات','name_fr'=>'Casablanca-Settat'],
            ['id'=>7,'name_ar'=>'جهة مراكش آسفي','name_fr'=>'Marrakech-Safi'],
            ['id'=>8,'name_ar'=>'جهة درعة تافيلالت','name_fr'=>'Drâa-Tafilalet'],
            ['id'=>9,'name_ar'=>'جهة سوس ماسة','name_fr'=>'Souss-Massa'],
            ['id'=>10,'name_ar'=>'جهة كلميم واد نون','name_fr'=>'Guelmim-Oued Noun'],
            ['id'=>11,'name_ar'=>'جهة العيون الساقية الحمراء','name_fr'=>'Laâyoune-Sakia El Hamra'],
            ['id'=>12,'name_ar'=>'جهة الداخلة وادي الذهب','name_fr'=>'Dakhla-Oued Ed Dahab'],
        ];
        foreach ($data as $row) {
            Region::updateOrCreate(['id'=>$row['id']], [
                'name_ar'=>$row['name_ar'],
                'name_fr'=>$row['name_fr'],
            ]);
        }
    }
}
