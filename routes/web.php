<?php

use App\Http\Controllers\Admin\StockOpnameController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Cek jika pengguna sudah login
    if (auth()->check()) {
        // Jika sudah login, arahkan ke admin/dashboard
        return redirect()->route('admin.dashboard');
    }
    // Jika belum login, arahkan ke halaman login
    return redirect()->to('/login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login');
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store'])->name('login.store');

});

Route::post('/logout', [\App\Http\Controllers\Auth\LogoutController::class, '__invoke'])->name('logout')->middleware('auth');

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::get('/dashboard', \App\Http\Controllers\Admin\DashboardController::class)->name('dashboard')->middleware('permission:dashboard.index');

    $resources = [
        'users' => [
            'controller' => \App\Http\Controllers\Admin\UserController::class,
            'permissions' => 'users.index|users.create|users.edit|users.delete',
            'name' => 'users'
        ],
        'roles' => [
            'controller' => \App\Http\Controllers\Admin\RoleController::class,
            'permissions' => 'roles.index|roles.create|roles.edit|roles.delete',
            'name' => 'roles'
        ],
        'suppliers' => [
            'controller' => \App\Http\Controllers\Admin\SupplierController::class,
            'permissions' => 'suppliers.index|suppliers.create|suppliers.edit|suppliers.delete',
            'name' => 'suppliers'
        ],
        'customers' => [
            'controller' => \App\Http\Controllers\Admin\CustomerController::class,
            'permissions' => 'customers.index|customers.create|customers.edit|customers.delete',
            'name' => 'customers'
        ],
        'categories' => [
            'controller' => \App\Http\Controllers\Admin\CategoryController::class,
            'permissions' => 'categories.index|categories.create|categories.edit|categories.delete',
            'name' => 'categories'
        ],
        'units' => [
            'controller' => \App\Http\Controllers\Admin\UnitController::class,
            'permissions' => 'units.index|units.create|units.edit|units.delete',
            'name' => 'units'
        ],
        'products' => [
            'controller' => \App\Http\Controllers\Admin\ProductController::class,
            'permissions' => 'products.index|products.create|products.edit|products.delete',
            'name' => 'products'
        ],
        'stocks' => [
            'controller' => \App\Http\Controllers\Admin\ProductStockController::class,
            'permissions' => 'stocks.index|stocks.create|stocks.edit|stocks.delete',
            'name' => 'stocks'
        ],
        'stock-opnames' => [
            'controller' => \App\Http\Controllers\Admin\StockOpnameController::class,
            'permissions' => 'stock-opnames.index|stock-opnames.create|stock-opnames.edit|stock-opnames.show',
            'name' => 'stock-opnames'
        ],
    ];

    foreach ($resources as $name => $resource) {
        $route = Route::resource($name, $resource['controller'])
            ->middleware("permission:{$resource['permissions']}");
        if (isset($resource['names'])) {
            $route->names($resource['names']);
        }
    }

    Route::prefix('sales')->name('sales.')->middleware('permission:transactions.index')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('index');
        Route::post('/add-product', [\App\Http\Controllers\Admin\TransactionController::class, 'addProductToCart'])->name('add-product');
        Route::delete('/delete-from-cart/{id}', [\App\Http\Controllers\Admin\TransactionController::class, 'deleteFromCart'])->name('delete-from-cart');
        Route::post('/process-payment', [\App\Http\Controllers\Admin\TransactionController::class, 'processPayment'])->name('process-payment');
        Route::post('/get-snap-token', [\App\Http\Controllers\Admin\TransactionController::class, 'getSnapToken'])->name('get-snap-token');
    });

    Route::prefix('report')->name('report.')->middleware('permission:reports.index')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('index');
        Route::get('/generate', [\App\Http\Controllers\Admin\ReportController::class, 'generate'])->name('generate');
    });

    Route::get('/stock-opnames/{id}/export', [StockOpnameController::class, 'export'])->name('stock-opnames.export');

    Route::get('/get-cities/{provinceId}', [\App\Http\Controllers\Admin\SupplierController::class, 'getCitiesByProvince'])->name('get-cities')
        ->middleware('permission:suppliers.index');

    Route::post('/get-courier-cost', [\App\Http\Controllers\Admin\ProductStockController::class, 'getCourierCost'])->name('get-courier-cost')
        ->middleware('permission:stocks.index');

});
