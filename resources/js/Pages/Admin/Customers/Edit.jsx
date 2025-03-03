import React from "react";
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from "../../../Layouts/AdminLayout";

export default function CustomerEdit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        email: customer.email || '',
        gender: customer.gender || 'pria',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/customers/${customer.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Customer updated successfully!',
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
                <title>Edit Customer - EasyPOS</title>
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
                                    <span className="font-weight-bold"><i className="bi bi-person"></i> Edit Customer</span>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Customer Name Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Customer Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Enter Customer Name"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <div className="alert alert-danger">{errors.name}</div>}
                                        </div>

                                        {/* Phone Number Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Phone Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                placeholder="Enter Phone Number"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                            />
                                            {errors.phone && <div className="alert alert-danger">{errors.phone}</div>}
                                        </div>

                                        {/* Email Address Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Email Address</label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder="Enter Email Address (Optional)"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors.email && <div className="alert alert-danger">{errors.email}</div>}
                                        </div>

                                        {/* Address Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Address</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                placeholder="Enter Address (Optional)"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                            />
                                            {errors.address && <div className="alert alert-danger">{errors.address}</div>}
                                        </div>

                                        {/* Gender Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Gender</label>
                                            <select
                                                className="form-select"
                                                value={data.gender}
                                                onChange={e => setData('gender', e.target.value)}
                                            >
                                                <option value="pria">Pria</option>
                                                <option value="wanita">Wanita</option>
                                            </select>
                                            {errors.gender && <div className="alert alert-danger">{errors.gender}</div>}
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
                </div>
            </AdminLayout>
        </>
    );
}
