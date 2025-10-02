<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'id' => 1,
                'priority' => 1,
                'is_active' => true,
                'question_ar' => 'ما هي منصة مشروع مهن؟',
                'question_fr' => "Qu'est-ce que la plateforme Projet Mihan ?",
                'answer_ar' => 'منصة مشروع مهن هي منصة مغربية تهدف إلى ربط العملاء بأفضل الحرفيين والمهنيين في جميع أنحاء المغرب. نوفر واجهة سهلة الاستخدام للبحث عن الخدمات المطلوبة والتواصل مع المحترفين المؤهلين.',
                'answer_fr' => "La plateforme Projet Mihan est une plateforme marocaine qui vise à connecter les clients avec les meilleurs artisans et professionnels à travers tout le Maroc. Nous fournissons une interface facile à utiliser pour rechercher les services requis et communiquer avec des professionnels qualifiés.",
            ],
        ];

        foreach ($rows as $r) {
            Faq::updateOrCreate(['id' => $r['id']], $r);
        }
    }
}
