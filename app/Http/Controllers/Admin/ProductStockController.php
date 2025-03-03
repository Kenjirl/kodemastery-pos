<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\StockProduct;
use App\Http\Requests\ProductStockRequest;
use App\Models\StockTotal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductStockController extends Controller
{
    public function index()
    {
        // Ambil data StockProduct beserta relasi product dan supplier.
        // Jika ada pencarian 'q', filter data berdasarkan nama supplier.
        $productStocks = StockProduct::with(['product', 'supplier'])
            ->when(request()->q, function ($query) {
                $query->whereHas('supplier', function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%');
                });
            })
            ->latest()
            ->paginate(10);

        // Ambil semua supplier untuk dropdown jika diperlukan
        $suppliers = Supplier::all();

        // Sertakan parameter pencarian 'q' di link paginasi
        $productStocks->appends(['q' => request()->q]);

        // Kembalikan data ke komponen Inertia 'Admin/ProductStocks/Index'
        return inertia('Admin/ProductStocks/Index', [
            'productStocks' => $productStocks,
            'suppliers' => $suppliers
        ]);
    }

    public function create()
    {
        // Ambil semua produk (beserta stok total) dan supplier
        $products = Product::with('stockTotal')->get();
        $suppliers = Supplier::all();

        // Kembalikan ke Inertia 'Admin/ProductStocks/Create' dengan data produk dan supplier
        return inertia('Admin/ProductStocks/Create', [
            'products' => $products,
            'suppliers' => $suppliers
        ]);
    }

    public function store(ProductStockRequest $request)
    {
        // Mulai transaksi database
        DB::beginTransaction();

        try {
            // Buat record StockProduct baru berdasarkan data yang divalidasi
            $stockProduct = StockProduct::create($request->validated());

            // Cari atau buat StockTotal untuk product_id terkait
            $stockTotal = StockTotal::firstOrCreate(
                ['product_id' => $stockProduct->product_id],
                ['total_stock' => 0]
            );

            // Tambahkan stok sesuai quantity yang diterima
            $stockTotal->total_stock += $stockProduct->stock_quantity;
            $stockTotal->save();

            // Commit transaksi jika semua operasi berhasil
            DB::commit();

            // Kembali ke daftar product stock dengan pesan sukses
            return redirect()->route('admin.stocks.index');
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.stocks.index');
        }
    }

    public function destroy($id)
    {
        // Mulai transaksi database untuk memastikan konsistensi data
        DB::beginTransaction();

        try {
            // Cari StockProduct berdasarkan ID yang diberikan. Jika tidak ditemukan, akan melemparkan ModelNotFoundException
            $stockProduct = StockProduct::findOrFail($id);

            // Cari StockTotal yang terkait dengan product_id dari StockProduct
            $stockTotal = StockTotal::where('product_id', $stockProduct->product_id)->first();

            if ($stockTotal) {
                // Kurangi total_stock dengan stock_quantity dari StockProduct yang akan dihapus
                $stockTotal->total_stock -= $stockProduct->stock_quantity;

                // Pastikan total_stock tidak menjadi negatif
                if ($stockTotal->total_stock < 0) {
                    $stockTotal->total_stock = 0;
                }

                // Simpan perubahan pada StockTotal
                $stockTotal->save();
            }

            // Hapus record StockProduct dari database
            $stockProduct->delete();

            // Commit transaksi jika semua operasi berhasil
            DB::commit();

            // Kembali ke daftar product stock dengan pesan sukses
            return redirect()->route('stocks.index');
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.stocks.index');
        }
    }
}
