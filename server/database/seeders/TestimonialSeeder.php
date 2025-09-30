<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $samples = [
            [
                'userId' => 4,
                'rating' => 5,
                'comment' => 'منصة رائعة لإيجاد الحرفيين المحترفين. سهولة في الاستخدام وجودة في الخدمة.',
                'isApproved' => true,
                'createdAt' => '2025-08-20T10:30:00Z',
            ],
            [
                'userId' => 5,
                'rating' => 5,
                'comment' => "Excellente expérience avec la plateforme. J'ai trouvé ce que je cherchais rapidement et facilement.",
                'isApproved' => true,
                'createdAt' => '2025-08-10T09:30:00Z',
            ],
            [
                'userId' => 6,
                'rating' => 5,
                'comment' => 'المنصة ساعدتني في الوصول لعملاء جدد وتطوير عملي. أنصح بها كل الحرفيين.',
                'isApproved' => true,
                'createdAt' => '2025-08-15T16:45:00Z',
            ],
            [
                'userId' => 7,
                'rating' => 4,
                'comment' => 'منصة مفيدة للحرفيين. التسجيل سهل والدعم ممتاز.',
                'isApproved' => true,
                'createdAt' => '2025-08-18T14:20:00Z',
            ],
        ];

        foreach ($samples as $s) {
            $userId = DB::table('users')->where('id', $s['userId'])->value('id');
            if (!$userId) {
                $userId = DB::table('users')->orderBy('id')->value('id');
                if (!$userId) continue;
            }

            Testimonial::updateOrCreate([
                'user_id' => $userId,
                'comment' => $s['comment'],
            ], [
                'rating' => $s['rating'],
                'is_approved' => (bool)$s['isApproved'],
                'created_at' => $s['createdAt'],
                'updated_at' => now(),
            ]);
        }
    }
}
