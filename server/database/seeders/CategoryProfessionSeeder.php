<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoryProfessionSeeder extends Seeder
{
    public function run(): void
    {
        $map = [
            1 => [4, 1, 2, 3],
            2 => [9, 10, 12, 13, 14, 15, 20],
            3 => [6],
            4 => [7, 8, 16, 17, 18],
            5 => [19],
            6 => [11],
        ];

        foreach ($map as $categoryId => $professionIds) {
            $cat = Category::find($categoryId);
            if (!$cat) { continue; }
            $cat->professions()->sync($professionIds);
        }
    }
}
