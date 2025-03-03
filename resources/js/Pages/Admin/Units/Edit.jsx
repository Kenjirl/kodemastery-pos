import React from "react";
import { usePage, Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from "../../../Layouts/AdminLayout";

export default function UnitEdit() {

    const { unit } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: unit.name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/units/${unit.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Unit updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
        });
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head>
                <title>Edit Unit - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card border rounded shadow border-top-success">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <button onClick={handleBack} className="btn btn-sm btn-secondary">
                                        <i className="fa fa-arrow-left"></i> Back
                                    </button>
                                    <span className="font-weight-bold">
                                        <i className="bi bi-tag-fill"></i> Edit Unit
                                    </span>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Unit Name Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Unit Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Enter Unit Name"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <div className="alert alert-danger">{errors.name}</div>}
                                        </div>

                                        {/* Submit Button */}
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
                </div>
            </AdminLayout>
        </>
    );
}
