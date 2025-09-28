<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $name = env('SUPERADMIN_NAME', 'Super Admin');
        $email = env('SUPERADMIN_EMAIL', 'superadmin@example.com');
        $password = env('SUPERADMIN_PASSWORD', '123456789');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'role' => 'SUPER_ADMIN',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
    }
}
