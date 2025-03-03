<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest; // Form Request khusus untuk validasi produk
use App\Models\Product; // Model untuk tabel produk
use App\Models\Category; // Model untuk tabel kategori
use App\Models\Unit; // Model untuk tabel unit
use App\Traits\ImageHandlerTrait; // Trait untuk menangani operasi gambar
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ImageHandlerTrait;

    /**
     * Tampilkan daftar produk.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Ambil data produk beserta relasi kategori dan stockTotal.
        // Jika ada pencarian 'q', filter berdasarkan nama produk.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).
        $products = Product::with(['category', 'stockTotal'])
            ->when(request()->q, function ($query) {
                $query->where('name', 'like', '%' . request()->q . '%');
            })
            ->latest()
            ->paginate(10);

        // Kirim data produk ke komponen Inertia 'Admin/Products/Index'.
        return inertia('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Tampilkan form untuk membuat produk baru.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Ambil semua kategori dan unit dari database.
        $categories = Category::all();
        $units = Unit::all();

        // Kirim data kategori dan unit ke komponen Inertia 'Admin/Products/Create'.
        return inertia('Admin/Products/Create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    /**
     * Simpan produk baru ke dalam database.
     *
     * @param  \App\Http\Requests\ProductRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ProductRequest $request)
    {
        // Inisialisasi nama gambar sebagai null (default tidak ada gambar).
        $imageName = null;

        // Jika ada file gambar yang diunggah, simpan gambar di folder 'products' dan dapatkan nama file.
        if ($request->hasFile('image')) {
            $imageName = $this->uploadImage($request->file('image'), 'products');
        }

        // Buat produk baru dengan data yang telah divalidasi, sertakan nama gambar jika ada.
        Product::create(array_merge(
            $request->validated(),
            ['image' => $imageName]
        ));

        // Arahkan pengguna kembali ke halaman daftar produk dengan pesan sukses.
        return redirect()->route('admin.products.index');
    }

    /**
     * Tampilkan form untuk mengedit produk tertentu.
     *
     * @param  \App\Models\Product  $product
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $product = Product::findOrFail($id);
        // Ambil semua kategori dan unit dari database.
        $categories = Category::all();
        $units = Unit::all();

        // Kirim data produk, kategori, dan unit ke komponen Inertia 'Admin/Products/Edit'.
        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    /**
     * Perbarui data produk dalam database.
     *
     * @param  \App\Http\Requests\ProductRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProductRequest $request, Product $product)
    {
        // Jika ada file gambar baru yang diunggah, perbarui gambar dan hapus gambar lama.
        if ($request->hasFile('image')) {
            $product->image = $this->updateImage($product->image, $request->file('image'), 'products');
        }

        // Perbarui data produk dengan data yang diterima dari permintaan.
        $product->name = $request->name;
        $product->barcode = $request->barcode;
        $product->category_id = $request->category_id;
        $product->unit_id = $request->unit_id;
        $product->selling_price = $request->selling_price;
        $product->save();

        // Arahkan pengguna kembali ke halaman daftar produk dengan pesan sukses.
        return redirect()->route('admin.products.index');
    }

    /**
     * Hapus produk dari database.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product)
    {
        // Jika produk memiliki gambar, hapus gambar dari folder 'products' di disk 'public'.
        if ($product->image) {
            Storage::disk('public')->delete('products/' . $product->image);
        }

        // Hapus data produk dari database.
        $product->delete();

        // Arahkan pengguna kembali ke halaman sebelumnya dengan pesan sukses.
        return back();
    }
}
