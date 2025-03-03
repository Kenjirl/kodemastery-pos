import React from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function RoleCreate() {
  // Ambil data errors dan permissions dari props (hasil inertia)
  const { errors, permissions } = usePage().props;

  // Inisialisasi data form
  const { data, setData, post, processing, reset } = useForm({
    name: "",
    permissions: [],
  });

  // Handler ketika checkbox di-check/uncheck
  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    const permId = parseInt(value);

    setData("permissions", checked
      ? [...data.permissions, permId]
      : data.permissions.filter((id) => id !== permId)
    );
  };

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/admin/roles", {
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil!",
          text: "Role baru berhasil dibuat.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: () => {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat membuat role.",
          icon: "error",
          showConfirmButton: true,
        });
      },
    });
  };

  return (
    <>
      <Head>
        <title>Create Roles - EasyPOS</title>
      </Head>
      <AdminLayout>
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 rounded shadow border-top-success">
              <div className="card-header">
                <span className="font-weight-bold">
                  <i className="bi bi-shield-fill-plus"></i> Add New Role
                </span>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Input nama role */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Enter Role Name"
                    />
                    {errors.name && (
                      <div className="alert alert-danger mt-2">{errors.name}</div>
                    )}
                  </div>

                  <hr />

                  {/* Daftar checkbox untuk permission */}
                  <div className="mb-3">
                    <label className="fw-bold">Permissions</label>
                    <div className="mt-2">
                      {permissions.map((permission) => (
                        <div className="form-check form-check-inline" key={permission.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            // Gunakan ID, bukan name
                            value={permission.id}
                            onChange={handlePermissionChange}
                            id={`perm-${permission.id}`}
                          />
                          <label className="form-check-label" htmlFor={`perm-${permission.id}`}>
                            {permission.name}
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
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          >
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
                      type="button"
                      className="btn btn-warning"
                      onClick={() => reset()}
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
