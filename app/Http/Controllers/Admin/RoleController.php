<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{

    public function index()
    {
        // Ambil semua role beserta relasi permissions-nya, urutkan dari terbaru, dan paginate
        $roles = Role::with('permissions')
            ->latest()
            ->paginate(10);

        // Kembalikan data ke komponen Inertia 'Admin/Roles/Index'
        return inertia('Admin/Roles/Index', compact('roles'));
    }

public function create()
{
    // Ambil semua permission
    $permissions = Permission::all();

    // Kembalikan ke Inertia 'Admin/Roles/Create' dengan data permissions
    return inertia('Admin/Roles/Create', [
        'permissions' => $permissions,
    ]);
}

    public function store(RoleRequest $request)
    {
        // Validasi data input melalui RoleRequest
        $validatedData = $request->validated();

        // Buat role baru dengan data yang telah divalidasi
        $role = Role::create($validatedData);

        // Tetapkan permissions pada role yang baru dibuat
        $role->syncPermissions($request->input('permissions'));

        // Jika berhasil simpan, arahkan dengan pesan sukses, jika gagal dengan pesan error
        if ($role) {
            return redirect()->route('admin.roles.index')->with(['success' => 'Data Berhasil Disimpan!']);
        } else {
            return redirect()->route('admin.roles.index')->with(['error' => 'Data Gagal Disimpan!']);
        }
    }

    public function edit(Role $role)
    {
        // Ambil semua permission, diurutkan dari yang terbaru
        $permissions = Permission::latest()->get();

        // Ambil ID dari permissions yang dimiliki oleh role saat ini
        $rolePermissions = $role->permissions->pluck('id')->toArray();

        // Map permissions agar hanya menyertakan 'id' dan 'name'
        $permissions = $permissions->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        });

        // Kembalikan data ke Inertia 'Admin/Roles/Edit' dengan data role, permissions, dan rolePermissions
        return inertia('Admin/Roles/Edit', [
            'permissions' => $permissions,
            'role' => $role,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        // Update data role dengan data yang telah divalidasi
        $role->name = $request->name;

        // Sync permissions
        $role->permissions()->sync($request->permissions);

        // Simpan perubahan
        $role->save();

        // Arahkan kembali ke daftar role
        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy($id)
    {
        // Cari role berdasarkan ID, error jika tidak ditemukan
        $role = Role::findOrFail($id);

        // Hapus role dari database
        $role->delete();

        // Arahkan kembali dengan pesan bahwa role berhasil dihapus
        return redirect()->route('admin.roles.index')->with('message', 'Role deleted successfully.');
    }
}
