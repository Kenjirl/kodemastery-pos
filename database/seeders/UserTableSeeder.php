<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserTableSeeder extends Seeder
{
    public function run(): void
    {
        // Cari role `admin` terlebih dahulu
        $adminRole = Role::where('name', 'admin')->first();

        // Jika role `admin` belum ada, buat role baru
        if (!$adminRole) {
            $adminRole = Role::create(['name' => 'admin']);
        }

        // Ambil semua izin yang ada
        $allPermissions = Permission::all();

        // Assign all permissions to `admin` role
        $adminRole->syncPermissions($allPermissions);

        // Buat user administrator atau ambil user yang sudah ada
        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('asdasd'),
            ]
        );

        // Assign role `admin` ke user
        $user->assignRole($adminRole);
    }
}
