<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\StockTotal;
use App\Models\Supplier;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // Statistik utama
        $totalSales = Transaction::where('status', 'success')->sum('total_amount');
        $totalTransactions  = Transaction::count();
        $totalCustomers     = Customer::count();
        $totalSuppliers     = Supplier::where('status', 'active')->count();

        // Total transaksi per status
        $transactionData = Transaction::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Penjualan per tanggal (status success)
        $salesData = Transaction::whereIn('status', ['success'])
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();


        // 5 produk terlaris
        $productsData = TransactionDetail::with('product')
            ->select('product_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function ($detail) {
                return [
                    'name'           => $detail->product->name ?? 'Unknown',
                    'total_quantity' => $detail->total_quantity,
                ];
            });

        // Total stok per kategori (tabel stock_totals)
        $stockTotals = StockTotal::with('product.category')->get();
        $groupedByCategory = $stockTotals->groupBy(fn($item) => optional($item->product->category)->name);
        $categoryData = $groupedByCategory->map(fn($items, $cat) => [
            'category'    => $cat,
            'total_stock' => $items->sum('total_stock'),
        ])->values();

        // Kirim data ke Inertia
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'totalSales'        => $totalSales,
                'totalTransactions' => $totalTransactions,
                'totalCustomers'    => $totalCustomers,
                'totalSuppliers'    => $totalSuppliers,
            ],
            'transactionData' => $transactionData,
            'salesData'       => $salesData,
            'productsData'    => $productsData,
            'categoryData'    => $categoryData,
        ]);
    }
}
