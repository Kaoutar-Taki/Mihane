<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\SuperAdminSeeder;
use Database\Seeders\RegionSeeder;
use Database\Seeders\CitySeeder;
use Database\Seeders\TestimonialSeeder;
use Database\Seeders\GenderSeeder;
use Database\Seeders\ProfessionSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\CategoryProfessionSeeder;
use Database\Seeders\FaqSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(SuperAdminSeeder::class);
        $this->call(RegionSeeder::class);
        $this->call(GenderSeeder::class);
        $this->call(ProfessionSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(CategoryProfessionSeeder::class);
        $this->call(CitySeeder::class);
        $this->call(TestimonialSeeder::class);
        $this->call(FaqSeeder::class);
    }
}
