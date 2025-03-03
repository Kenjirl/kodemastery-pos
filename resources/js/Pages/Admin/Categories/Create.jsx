// resources/js/Pages/Admin/Categories/Create.jsx

import React from "react";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function CategoryCreate() {
    // Menginisialisasi form dengan useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    // Fungsi handleSubmit untuk mengirim data kategori
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/categories", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Category created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset(); // Reset form setelah berhasil
            },
        });
    };

    // Fungsi handleChange untuk menangani perubahan pada input form
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <>
            <Head>
                <title>Create Category - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="d-flex justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card border rounded shadow border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold">
                                    <i className="bi bi-folder-plus"></i> Add New Category
                                </span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Input untuk Category Name */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                            placeholder="Enter Category Name"
                                            value={data.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <div className="alert alert-danger">{errors.name}</div>
                                        )}
                                    </div>

                                    {/* Input untuk Description */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea
                                            name="description"
                                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                            placeholder="Enter Description (Optional)"
                                            value={data.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && (
                                            <div className="alert alert-danger">{errors.description}</div>
                                        )}
                                    </div>

                                    {/* Tombol Submit dan Reset */}
                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="submit"
                                            className="btn btn-md btn-success me-2"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    loading...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save"></i> Save
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="reset"
                                            className="btn btn-md btn-warning"
                                            onClick={() => reset()}
                                        >
                                            <i className="fa fa-redo"></i> Reset
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
