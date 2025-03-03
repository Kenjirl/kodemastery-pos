<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\StockTotal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class TransactionController extends Controller
{
    /**
     * Menampilkan halaman transaksi dan data terkait.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Ambil parameter query dari Midtrans
        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $transactionStatus = $request->input('transaction_status');

        // Cek apakah ada parameter query
        if ($orderId && $statusCode && $transactionStatus) {
            // Cari transaksi berdasarkan order_id
            $transaction = Transaction::where('invoice', $orderId)->first();

            if ($transaction) {
                // Update status transaksi berdasarkan status dari Midtrans
                if ($statusCode == 200 && $transactionStatus == 'settlement') {
                    $transaction->status = 'success';
                } elseif ($transactionStatus == 'pending') {
                    $transaction->status = 'pending';
                } elseif ($transactionStatus == 'failed') {
                    $transaction->status = 'failed';
                }
                $transaction->save();
            }

            // Redirect ke URL yang bersih tanpa query parameters
            return redirect()->route('admin.sales.index');
        }

        // Ambil semua data yang diperlukan
        $customers = Customer::all();
        $products = Product::all();
        $categories = Category::all();

        // Ambil data cart untuk user yang sedang login
        $carts = Cart::with('product')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'selling_price' => $item->product->selling_price,
                ];
            });

        // URL pembayaran Midtrans (jika diperlukan)
        $payment_link_url = $request->input('payment_link_url', null);

        // Return ke view dengan data yang telah disiapkan
        return Inertia::render('Admin/Transactions/Index', [
            'customers' => $customers,
            'products' => $products,
            'categories' => $categories,
            'carts' => $carts,
            'payment_link_url' => $payment_link_url,
        ]);
    }

    /**
     * Menambahkan produk ke keranjang dengan validasi stok.
     */
    public function addProductToCart(Request $request)
    {
        // Validasi data yang diterima dari request
        $validatedData = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:1000',
        ]);

        $userId = Auth::id();
        $customerId = $validatedData['customer_id'] ?? null;

        // Pastikan user sedang login
        if (!$userId) {
            return redirect()->route('login');
        }

        // Ambil total stok produk berdasarkan product_id
        $productStock = StockTotal::where('product_id', $validatedData['product_id'])->value('total_stock');
        if ($productStock === null) {
            return redirect()->back()->withErrors(['quantity' => 'Stok produk masih 0.']);
        }

        // Jumlahkan kuantitas produk yang ada di keranjang
        $cartQuantity = Cart::where('user_id', $userId)
            ->where('product_id', $validatedData['product_id'])
            ->sum('quantity');
        $newQuantity = $cartQuantity + $validatedData['quantity'];

        // Validasi jika kuantitas melebihi stok
        if ($newQuantity > $productStock) {
            return redirect()->back()->withErrors(['quantity' => 'Kuantitas melebihi stok yang tersedia. Stok saat ini: ' . $productStock]);
        }

        // Cari item di cart berdasarkan user_id dan product_id
        $cartItem = Cart::where('user_id', $userId)
            ->where('product_id', $validatedData['product_id'])
            ->first();

        // Jika item ditemukan, update kuantitas dan total harga
        if ($cartItem) {
            if ($customerId && $cartItem->customer_id !== $customerId) {
                $cartItem->customer_id = $customerId;
            }
            $cartItem->quantity += $validatedData['quantity'];
            $cartItem->total_price += $validatedData['total_price'];
            $cartItem->save();
        } else {
            // Jika item tidak ditemukan, buat entry baru di tabel cart
            Cart::create([
                'user_id' => $userId,
                'customer_id' => $customerId,
                'product_id' => $validatedData['product_id'],
                'quantity' => $validatedData['quantity'],
                'total_price' => $validatedData['total_price'],
            ]);
        }

        return redirect()->back();
    }

    /**
     * Memproses pembayaran (cash/online) dan menghapus cart jika proses berhasil.
     */
    public function processPayment(Request $request)
    {
        // Validasi data yang diterima dari request
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'total_amount' => 'required|numeric|min:0',
            'cash' => 'nullable|numeric|min:0',
            'change' => 'nullable|numeric|min:0',
            'cart_items' => 'required|array',
            'cart_items.*.product_id' => 'required|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'discount' => 'nullable|numeric',
            'payment_method' => 'required|in:cash,online',
        ]);

        $snapToken = null;
        $userId = Auth::id();

        // Gunakan DB transaction untuk memastikan data konsisten
        DB::transaction(function () use ($validated, &$snapToken, $userId) {
            // Buat transaksi baru
            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'],
                'user_id' => $userId,
                'total_amount' => $validated['total_amount'],
                'cash' => $validated['payment_method'] === 'cash' ? $validated['cash'] : null,
                'change' => $validated['payment_method'] === 'cash' ? $validated['change'] : null,
                'discount' => $validated['discount'] ?? '0',
                'payment_method' => $validated['payment_method'],
                'status' => $validated['payment_method'] === 'online' ? 'pending' : 'success',
            ]);

            // Cek stok setiap produk di keranjang dan proses transaksi
            foreach ($validated['cart_items'] as $item) {
                $product = Product::find($item['product_id']);
                $stockTotal = StockTotal::where('product_id', $product->id)->first();

                if (!$stockTotal || $stockTotal->total_stock < $item['quantity']) {
                    return redirect()->back()->withErrors([
                        'quantity' => "Stok produk untuk {$product->name} tidak mencukupi. Stok saat ini: "
                                      . ($stockTotal->total_stock ?? 0)
                    ]);
                }

                // Kurangi stok
                $stockTotal->total_stock -= $item['quantity'];
                $stockTotal->save();

                // Tambahkan detail transaksi
                $transaction->transactionDetails()->create([
                    'product_id' => $item['product_id'],
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['quantity'] * $product->selling_price,
                ]);
            }

            // Hapus cart untuk user_id dan customer_id yang sesuai
            if ($validated['customer_id']) {
                Cart::where('user_id', $userId)
                    ->whereNull('customer_id')
                    ->update(['customer_id' => $validated['customer_id']]);

                Cart::where('customer_id', $validated['customer_id'])
                    ->where('user_id', $userId)
                    ->delete();
            } else {
                Cart::where('user_id', $userId)->delete();
            }

            // Jika online, buat transaksi Midtrans dan dapatkan Snap Token
            if ($validated['payment_method'] === 'online') {
                $snapToken = $this->createMidtransTransaction($transaction);
            }
        });

        // Kembalikan Snap Token jika metode pembayaran online, atau pesan sukses jika cash
        if ($validated['payment_method'] === 'online') {
            return redirect()->route('admin.sales.index', ['payment_link_url' => $snapToken]);
        }

        return redirect()->route('admin.sales.index');
    }

    /**
     * Membuat Snap Token dari Midtrans.
     */
    protected function createMidtransTransaction($transaction)
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $params = [
            'transaction_details' => [
                'order_id' => $transaction->invoice,
                'gross_amount' => $transaction->total_amount,
            ],
            'customer_details' => [
                'first_name' => $transaction->customer->name ?? 'Guest',
                'email' => $transaction->customer->email ?? 'guest@example.com',
            ],
            'item_details' => $transaction->transactionDetails->map(function($detail) {
                return [
                    'id' => $detail->product_id,
                    'price' => $detail->subtotal / $detail->quantity,
                    'quantity' => $detail->quantity,
                    'name' => $detail->product_name,
                ];
            })->toArray(),
            'callbacks' => [
                'finish' => route('admin.sales.index'),
            ],
        ];

        $snapToken = Snap::getSnapToken($params);
        $transaction->update(['payment_link_url' => $snapToken]);

        return $snapToken;
    }

    /**
     * Menghapus item dari keranjang berdasarkan ID.
     */
    public function deleteFromCart($id)
    {
        $cartItem = Cart::find($id);
        if ($cartItem) {
            $cartItem->delete();
            return redirect()->back()->with('success', 'Item berhasil dihapus');
        }
        return redirect()->back()->withErrors(['message' => 'Item tidak ditemukan']);
    }

}
