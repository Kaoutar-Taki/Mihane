<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ArtisanProfile;
use App\Models\User;
use App\Models\Profession;
use App\Models\Category;

class ArtisanProfileSeeder extends Seeder
{
    public function run(): void
    {
        $samples = [
            [
                'id' => 1,
                'user_lookup' => ['id' => 2, 'role' => 'ARTISAN'],
                'profession_lookup' => ['id' => 4],
                'category_lookup' => ['id' => 1],
                'title_ar' => 'بناء محترف',
                'title_fr' => 'Maçon professionnel',
                'description_ar' => 'بناء محترف مع خبرة أكثر من 15 سنة في البناء والتشييد. متخصص في البناء التقليدي والحديث، الترميم والتجديد.',
                'description_fr' => "Maçon professionnel avec plus de 15 ans d'expérience en construction. Spécialisé dans la construction traditionnelle et moderne, rénovation et réhabilitation.",
                'gallery' => [
                    '/assets/1.jpg','/assets/2.jpg','/assets/3.jpg','/assets/4.jpg'
                ],
                'social' => [
                    'facebook' => 'https://www.facebook.com/nassrine.builder',
                    'instagram' => 'https://www.instagram.com/nassrine_construction',
                    'website' => 'https://www.nassrine.builder.ma',
                ],
                'availability' => [
                    'hours' => ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'],
                    'days' => ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'],
                ],
                'address_ar' => 'حي المعاريف، شارع الحسن الثاني، الدار البيضاء',
                'address_fr' => 'Quartier Maarif, Avenue Hassan II, Casablanca',
                'visibility' => 'PUBLIC',
                'verify_status' => 'VERIFIED',
            ],
        ];

        foreach ($samples as $s) {
            $user = null;
            if (isset($s['user_lookup']['id'])) {
                $user = User::where('id', $s['user_lookup']['id'])->where('role', $s['user_lookup']['role'])->first();
            }
            if (!$user) continue; 
            $profession = null;
            if (isset($s['profession_lookup']['id'])) {
                $profession = Profession::find($s['profession_lookup']['id']);
            }
            $category = null;
            if (isset($s['category_lookup']['id'])) {
                $category = Category::find($s['category_lookup']['id']);
            }

            ArtisanProfile::updateOrCreate(
                ['id' => $s['id']],
                [
                    'user_id' => $user->id,
                    'profession_id' => $profession?->id,
                    'category_id' => $category?->id,
                    'title_ar' => $s['title_ar'],
                    'title_fr' => $s['title_fr'] ?? null,
                    'description_ar' => $s['description_ar'] ?? null,
                    'description_fr' => $s['description_fr'] ?? null,
                    'gallery' => $s['gallery'] ?? [],
                    'social' => $s['social'] ?? [],
                    'availability' => $s['availability'] ?? [],
                    'address_ar' => $s['address_ar'] ?? null,
                    'address_fr' => $s['address_fr'] ?? null,
                    'visibility' => $s['visibility'] ?? 'PUBLIC',
                    'verify_status' => $s['verify_status'] ?? 'PENDING',
                ]
            );
        }
    }
}
