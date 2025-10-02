<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id'=>1,'name_ar'=>'البناء والتشييد','name_fr'=>'Construction et Bâtiment','description_ar'=>'خدمات البناء والتشييد والترميم','description_fr'=>'Services de construction, bâtiment et rénovation','icon'=>'🏗️','color'=>'#FF6B35','is_active'=>true,'display_order'=>1],
            ['id'=>2,'name_ar'=>'الحرف التقليدية','name_fr'=>'Artisanat Traditionnel','description_ar'=>'الحرف اليدوية والتقليدية المغربية','description_fr'=>'Artisanat traditionnel et manuel marocain','icon'=>'🎨','color'=>'#4ECDC4','is_active'=>true,'display_order'=>2],
            ['id'=>3,'name_ar'=>'الزراعة والفلاحة','name_fr'=>'Agriculture','description_ar'=>'خدمات الزراعة والفلاحة والبستنة','description_fr'=>'Services d\'agriculture, jardinage et horticulture','icon'=>'🌱','color'=>'#95E1D3','is_active'=>true,'display_order'=>3],
            ['id'=>4,'name_ar'=>'الخدمات التقنية','name_fr'=>'Services Techniques','description_ar'=>'الخدمات التقنية والصيانة','description_fr'=>'Services techniques et maintenance','icon'=>'🔧','color'=>'#F38BA8','is_active'=>true,'display_order'=>4],
            ['id'=>5,'name_ar'=>'الخدمات المنزلية','name_fr'=>'Services Domestiques','description_ar'=>'خدمات التنظيف والصيانة المنزلية','description_fr'=>'Services de nettoyage et maintenance domestique','icon'=>'🏠','color'=>'#A8DADC','is_active'=>true,'display_order'=>5],
            ['id'=>6,'name_ar'=>'التصميم والديكور','name_fr'=>'Design et Décoration','description_ar'=>'خدمات التصميم والديكور الداخلي','description_fr'=>'Services de design et décoration intérieure','icon'=>'✨','color'=>'#FFD23F','is_active'=>true,'display_order'=>6],
        ];

        foreach ($data as $row) {
            Category::updateOrCreate(
                ['id' => $row['id']],
                [
                    'name_ar' => $row['name_ar'],
                    'name_fr' => $row['name_fr'] ?? null,
                    'description_ar' => $row['description_ar'] ?? null,
                    'description_fr' => $row['description_fr'] ?? null,
                    'icon' => $row['icon'] ?? null,
                    'color' => $row['color'] ?? null,
                    'is_active' => (bool)($row['is_active'] ?? true),
                    'display_order' => $row['display_order'] ?? null,
                ]
            );
        }
    }
}
