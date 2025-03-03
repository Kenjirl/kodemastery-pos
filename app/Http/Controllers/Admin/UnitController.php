<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UnitRequest;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Tampilkan daftar semua unit.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Ambil data unit dengan fitur pencarian berdasarkan nama jika ada query 'q'
    $units = Unit::when(request()->q, function($query) {
        return $query->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10); // Urutkan berdasarkan yang terbaru dan paginate 10 per halaman

        // Sertakan query string 'q' dalam link paginasi
        $units->appends(['q' => request()->q]);

        // Kembalikan data ke komponen Inertia 'Admin/Units/Index'
        return inertia('Admin/Units/Index', [
            'units' => $units
        ]);
    }

    /**
     * Tampilkan form untuk membuat unit baru.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // Kembalikan ke Inertia 'Admin/Units/Create'
        return inertia('Admin/Units/Create');
    }

    /**
     * Simpan unit baru ke dalam database.
     *
     * @param  \App\Http\Requests\UnitRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UnitRequest $request)
    {
        // Buat unit baru berdasarkan data yang telah divalidasi
        Unit::create($request->validated());

        // Arahkan kembali ke daftar unit
        return redirect()->route('admin.units.index');
    }

    /**
     * Tampilkan form untuk mengedit unit tertentu.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // Cari unit berdasarkan ID, error jika tidak ditemukan
        $unit = Unit::findOrFail($id);

        // Kembalikan data unit ke Inertia 'Admin/Units/Edit'
        return inertia('Admin/Units/Edit', [
            'unit' => $unit
        ]);
    }

    /**
     * Perbarui unit yang sudah ada di database.
     *
     * @param  \App\Http\Requests\UnitRequest  $request
     * @param  \App\Models\Unit  $unit
     * @return \Illuminate\Http\Response
     */
    public function update(UnitRequest $request, Unit $unit)
    {
        // Perbarui data unit dengan data yang telah divalidasi
        $unit->update($request->validated());

        // Arahkan kembali ke daftar unit
        return redirect()->route('admin.units.index');
    }

    /**
     * Hapus unit dari database.
     *
     * @param  \App\Models\Unit  $unit
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
         // Ambil Unit berdasarkan ID, error jika tidak ditemukan
            $unit = Unit::findOrFail($id);

        // Hapus unit dari database
        $unit->delete();

        // Arahkan kembali ke daftar unit dengan pesan sukses
        return redirect()->route('admin.units.index');
    }
}
