<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Tampilkan daftar kategori.
     */
    public function index()
    {
        // Ambil data kategori, jika ada parameter pencarian 'q', filter berdasarkan nama
        $categories = Category::when(request()->q, function($query) {
            return $query->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10); // Ambil kategori terbaru, 10 data per halaman

        // Sertakan parameter pencarian dalam link paginasi
        $categories->appends(['q' => request()->q]);

        // Kembalikan data ke komponen Inertia 'Admin/Categories/Index'
        return Inertia('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Tampilkan form untuk membuat kategori baru.
     */
    public function create()
    {
        // Kembalikan ke tampilan Inertia 'Admin/Categories/Create'
        return Inertia('Admin/Categories/Create');
    }

    /**
     * Simpan kategori baru ke dalam database.
     */
    public function store(CategoryRequest $request)
    {
        // Validasi input dan simpan kategori baru
        Category::create($request->validated());

        // Arahkan kembali ke halaman kategori
        return redirect()->route('admin.categories.index');
    }

    /**
     * Tampilkan form untuk mengedit kategori tertentu.
     */
    public function edit($id)
    {
        // Cari kategori berdasarkan ID, jika tidak ditemukan akan error
        $category = Category::findOrFail($id);

        // Kembalikan data kategori ke tampilan Inertia 'Admin/Categories/Edit'
        return Inertia('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Perbarui kategori yang sudah ada di database.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        // Validasi dan perbarui data kategori
        $category->update($request->validated());

        // Arahkan kembali ke halaman kategori
        return redirect()->route('admin.categories.index');
    }

    /**
     * Hapus kategori dari database.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index');
    }
}
