<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profession;

class ProfessionSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [ 'id' => 1,   'name_ar' => 'نجار','name_fr' => 'Menuisier',   'image' => null ],
            [ 'id' => 2, 'name_ar' => 'كهربائي',     'name_fr' => 'Électricien', 'image' => null ],
            [ 'id' => 3,    'name_ar' => 'سباك',        'name_fr' => 'Plombier',    'image' => null ],
            [ 'id' => 4,       'name_ar' => 'بناء',        'name_fr' => 'Maçon',       'image' => null ],
            [ 'id' => 5,     'name_ar' => 'صباغ',        'name_fr' => 'Peintre',     'image' => null ],
            [ 'id' => 6, 'name_ar' => 'فلاح',        'name_fr' => 'Agriculteur', 'image' => null ],
            [ 'id' => 7,  'name_ar' => 'ميكانيكي',    'name_fr' => 'Mécanicien',  'image' => null ],
            [ 'id' => 8,  'name_ar' => 'حداد',        'name_fr' => 'Ferronnier',  'image' => null ],
            [ 'id' => 9,     'name_ar' => 'صانع تقليدي', 'name_fr' => 'Artisan',     'image' => null ],
            [ 'id' => 10, 'name_ar' => 'خياط',        'name_fr' => 'Tailleur', 'image' => null ],
            [ 'id' => 11,  'name_ar' => 'مُزيّن',    'name_fr' => 'Décorateur',  'image' => null ],
            [ 'id' => 12,  'name_ar' => 'صانع أحذية',        'name_fr' => 'Cordonnier',  'image' => null ],
            [ 'id' => 13,     'name_ar' => 'إسكافي', 'name_fr' => 'Couturier',     'image' => null ],
            [ 'id' => 14, 'name_ar' => 'صانع الفخار',        'name_fr' => 'Potier', 'image' => null ],
            [ 'id' => 15,  'name_ar' => 'صانع الزرابي',    'name_fr' => 'Tisserand',  'image' => null ],
            [ 'id' => 16,  'name_ar' => 'عامل زجاج',        'name_fr' => 'Vitrailliste',  'image' => null ],
            [ 'id' => 17,     'name_ar' => 'عامل رخام', 'name_fr' => 'Marbrier',     'image' => null ],
            [ 'id' => 18, 'name_ar' => 'نجار ألمنيوم',        'name_fr' => 'Menuisier Aluminium', 'image' => null ],
            [ 'id' => 19,  'name_ar' => 'عامل نظافة',    'name_fr' => 'Agent de nettoyage',  'image' => null ],
            [ 'id' => 20,  'name_ar' => 'صانع مجوهرات',        'name_fr' => 'Bijoutier',  'image' => null ],
        ];

        foreach ($data as $row) {
            Profession::updateOrCreate(
                ['id' => $row['id']],
                [
                    'name_ar' => $row['name_ar'],
                    'name_fr' => $row['name_fr'] ?? null,
                    'image'   => $row['image'] ?? null,
                ]
            );
        }
    }
}
