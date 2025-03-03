import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from "../../../Layouts/AdminLayout";

export default function RoleEdit() {
  const { permissions, role, rolePermissions } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    permissions: rolePermissions || [],
  });

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    const permId = parseInt(value);
    setData('permissions', checked
      ? [...data.permissions, permId]
      : data.permissions.filter(id => id !== permId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/roles/${role.id}`, {
      onSuccess: () => {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Role berhasil diperbarui.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: () => {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui role.',
          icon: 'error',
          showConfirmButton: true,
        });
      },
    });
  };

  return (
    <>
      <Head>
        <title>Edit Role - Geek Store</title>
      </Head>
      <AdminLayout>
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 rounded shadow border-top-success">
              <div className="card-header">
                <strong><i className="bi bi-shield-fill-check"></i> Edit Role</strong>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Enter Role Name"
                    />
                    {errors.name && (
                      <div className="alert alert-danger mt-2">{errors.name}</div>
                    )}
                  </div>

                  <hr />

                  <div className="mb-3">
                    <label className="fw-bold">Permissions</label>
                    <div className="mt-2">
                      {permissions.map((p) => (
                        <div className="form-check form-check-inline" key={p.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={p.id}
                            checked={data.permissions.includes(p.id)}
                            onChange={handlePermissionChange}
                            id={`perm-${p.id}`}
                          />
                          <label className="form-check-label" htmlFor={`perm-${p.id}`}>
                            {p.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.permissions && (
                      <div className="alert alert-danger mt-2">{errors.permissions}</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-success me-2"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save"></i> Save
                        </>
                      )}
                    </button>
                    <button
                      type="reset"
                      className="btn btn-warning"
                    >
                      <i className="bi bi-arrow-counterclockwise"></i> Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
