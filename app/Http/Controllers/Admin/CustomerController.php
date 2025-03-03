<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Tampilkan daftar customer.
     */
    public function index()
    {
        // Ambil data customer, jika ada parameter pencarian 'q', filter berdasarkan nama customer saja
    $customers = Customer::when(request()->q, function ($query) {
        $query->where('name', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10);

        // Sertakan query string 'q' dalam link paginasi
        $customers->appends(['q' => request()->q]);

        // Kembalikan data ke komponen Inertia 'Admin/Customers/Index'
        return inertia('Admin/Customers/Index', [
            'customers' => $customers
        ]);
    }

    /**
     * Tampilkan form untuk membuat customer baru.
     */
    public function create()
    {
        // Kembalikan ke tampilan Inertia 'Admin/Customers/Create'
        return inertia('Admin/Customers/Create');
    }

    /**
     * Simpan customer baru ke dalam database.
     */
    public function store(CustomerRequest $request)
    {
        // Buat customer baru berdasarkan input yang telah divalidasi
        Customer::create($request->validated());

        // Arahkan kembali ke indeks customer dengan pesan sukses
        return redirect()->route('admin.customers.index');
    }

    /**
     * Tampilkan form untuk mengedit customer tertentu.
     */
    public function edit($id)
    {
        // Ambil data customer berdasarkan ID, akan error jika tidak ditemukan
        $customer = Customer::findOrFail($id);

        // Kembalikan data customer ke Inertia 'Admin/Customers/Edit'
        return inertia('Admin/Customers/Edit', [
            'customer' => $customer
        ]);
    }

    /**
     * Perbarui data customer yang sudah ada di database.
     */
    public function update(CustomerRequest $request, Customer $customer)
    {
        // Perbarui customer dengan data yang telah divalidasi
        $customer->update($request->validated());

        // Arahkan kembali ke indeks customer dengan pesan sukses
        return redirect()->route('admin.customers.index');
    }

    /**
     * Hapus customer dari database.
     */
    public function destroy($id)
    {
        // Ambil customer berdasarkan ID, error jika tidak ditemukan
        $customer = Customer::findOrFail($id);

        // Hapus customer tersebut
        $customer->delete();

        // Arahkan kembali ke indeks customer dengan pesan sukses
        return redirect()->route('admin.customers.index');
    }
}
