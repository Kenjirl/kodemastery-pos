import React from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function CategoryEdit() {

   const { category } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/categories/${category.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Category updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
        });
    };

    return (
        <>
            <Head>
                <title>Edit Category - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="d-flex justify-content-center mt-5">
                    <div className="col-6">
                        <div className="card border rounded border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold">
                                    <i className="bi bi-folder-fill"></i> Edit Category
                                </span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Category Name Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Enter Category Name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <div className="alert alert-danger">{errors.name}</div>}
                                    </div>

                                    {/* Description Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea
                                            name="description"
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            placeholder="Enter Description (Optional)"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                        />
                                        {errors.description && <div className="alert alert-danger">{errors.description}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-success me-2" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    loading...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save"></i> Save Changes
                                                </>
                                            )}
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
