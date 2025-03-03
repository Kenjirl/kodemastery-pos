<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;

class UserController extends Controller
{
    /**
     * Menampilkan daftar user.
     */
    public function index()
    {
        // Mengambil data user berdasarkan pencarian (jika ada)
        $users = User::when(request()->q, function($query) {
            $query->where('name', 'like', '%'. request()->q . '%');
        })->with('roles')->latest()->paginate(5);

        // Menambahkan query 'q' ke pagination, agar link pagination tetap menyertakan kata kunci pencarian
        $users->appends(['q' => request()->q]);

        // Mengirimkan data ke komponen Inertia
        return inertia('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Menampilkan form untuk membuat user baru.
     */
    public function create()
    {
        // Mengambil semua role
        $roles = Role::all();

        // Mengirimkan data role ke komponen Inertia
        return inertia('Admin/Users/Create', [
            'roles' => $roles
        ]);
    }

    /**
     * Menyimpan user baru ke database.
     */
    public function store(UserRequest $request)
    {
        // Membuat user baru berdasarkan data yang telah divalidasi di UserRequest
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password)
        ]);

        // Memberikan role ke user
        $user->assignRole($request->roles);

        // Redirect ke index
        return redirect()->route('admin.users.index');
    }

    /**
     * Menampilkan form untuk mengedit user.
     */
    public function edit($id)
    {
        // Mengambil user dan role-nya
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();

        // Mengirimkan data user dan roles ke komponen Inertia
        return inertia('Admin/Users/Edit', [
            'user'  => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Memperbarui data user yang sudah ada.
     */
    public function update(UserRequest $request, User $user)
    {
        // Menyiapkan data yang akan diupdate
        $data = [
            'name'  => $request->name,
            'email' => $request->email
        ];

        // Jika password diisi, maka perbarui password
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        // Update data user
        $user->update($data);

        // Sinkronisasi role untuk user tersebut
        $user->syncRoles($request->roles);

        // Redirect ke index
        return redirect()->route('admin.users.index');
    }

    /**
     * Menghapus user dari database.
     */
    public function destroy($id)
    {
        // Mencari user berdasarkan ID
        $user = User::findOrFail($id);

        // Menghapus user
        $user->delete();

        // Redirect ke index
        return redirect()->route('admin.users.index');
    }
}
