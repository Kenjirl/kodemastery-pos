<?php

namespace App\Http\Controllers\Admin;

use App\Models\Supplier;
use App\Models\Province;
use App\Models\City;
use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SupplierController extends Controller
{
    /**
     * Tampilkan daftar semua supplier.
     */
    public function index()
    {
        // Ambil data supplier dengan fitur pencarian berdasarkan nama jika ada query 'q'
        $suppliers = Supplier::when(request()->q, function($suppliers) {
            return $suppliers->where('name', 'like', '%'. request()->q . '%');
        })->latest()->paginate(5); // Urutkan berdasarkan yang terbaru dan paginate 5 per halaman

        // Sertakan query string 'q' dalam link paginasi
        $suppliers->appends(['q' => request()->q]);

        // Kembalikan data ke komponen Inertia 'Admin/Suppliers/Index'
        return inertia('Admin/Suppliers/Index', [
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Tampilkan form untuk membuat supplier baru.
     */
    public function create()
    {
        // Ambil semua provinsi untuk dropdown
        $provinces = Province::all(); // Ambil semua provinsi

        // Inisialisasi array kota kosong
        $cities = []; // Initial array untuk kota kosong

        // Kembalikan data ke Inertia 'Admin/Suppliers/Create' dengan data provinsi dan kota kosong
        return inertia('Admin/Suppliers/Create', [
            'provinces' => $provinces,
            'cities' => $cities, // Kirim data kota kosong pertama kali
        ]);
    }

    /**
     * Simpan supplier baru ke dalam database.
     */
    public function store(SupplierRequest $request)
    {
        // Buat supplier baru berdasarkan data yang telah divalidasi
        Supplier::create($request->validated());

        // Arahkan kembali ke daftar supplier
        return redirect()->route('admin.suppliers.index');
    }

    /**
     * Tampilkan form untuk mengedit supplier tertentu.
     */
    public function edit($id)
    {
        // Cari supplier berdasarkan ID, error jika tidak ditemukan
        $supplier = Supplier::findOrFail($id);

        // Ambil semua provinsi untuk dropdown
        $provinces = Province::all(); // Ambil semua provinsi

        // Ambil kota berdasarkan provinsi supplier saat ini
        $cities = City::where('province_id', $supplier->province_id)->get(); // Ambil kota berdasarkan provinsi supplier

        // Kembalikan data ke Inertia 'Admin/Suppliers/Edit' dengan data supplier, provinsi, dan kota
        return inertia('Admin/Suppliers/Edit', [
            'supplier' => $supplier,
            'provinces' => $provinces,
            'cities' => $cities,
        ]);
    }

    /**
     * Perbarui data supplier yang sudah ada di database.
     */
    public function update(SupplierRequest $request, Supplier $supplier)
    {
        // Perbarui data supplier dengan data yang telah divalidasi
        $supplier->update($request->validated());

        // Arahkan kembali ke daftar supplier
        return redirect()->route('admin.suppliers.index');
    }

    /**
     * Hapus supplier dari database.
     */
    public function destroy($id)
    {
        // Cari supplier berdasarkan ID, error jika tidak ditemukan
        $supplier = Supplier::findOrFail($id);

        // Hapus supplier dari database
        $supplier->delete();

        // Arahkan kembali ke daftar supplier dengan pesan sukses
        return redirect()->route('admin.suppliers.index');
    }

    /**
     * Ambil daftar kota berdasarkan ID provinsi.
     *
     * @param int $provinceId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCitiesByProvince($provinceId)
    {
        // Ambil semua kota yang berada di provinsi tertentu
        $cities = City::where('province_id', $provinceId)->get();

        // Kembalikan data kota dalam format JSON
        return response()->json($cities);
    }
}
