<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = [
            'dashboard' => ['index', 'view_sales', 'view_transactions', 'view_products', 'view_supplier', 'view_customers'],
            'users' => ['index', 'create', 'edit', 'delete'],
            'roles' => ['index', 'create', 'edit', 'delete'],
            'suppliers' => ['index', 'create', 'edit', 'delete'],
            'customers' => ['index', 'create', 'edit', 'delete'],
            'categories' => ['index', 'create', 'edit', 'delete'],
            'units' => ['index', 'create', 'edit', 'delete'],
            'products' => ['index', 'create', 'edit', 'delete'],
            'stocks' => ['index', 'create', 'edit', 'delete'],
            'transactions' => ['index'],
            'reports' => ['index'],
            'stock-opnames' => ['index', 'create', 'edit','show'],
        ];

        foreach ($resources as $resource => $actions) {
            foreach ($actions as $action) {
                $permissionName = "{$resource}.{$action}";

                Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
            }
        }
    }
}
