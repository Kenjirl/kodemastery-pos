import React, { useState, useEffect } from "react";
import { useForm, Head, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from "../../../Layouts/AdminLayout";

export default function SupplierEdit() {
    // Menggunakan usePage() untuk mendapatkan props dari server
    const { supplier, provinces } = usePage().props;

    // Menggunakan useForm() untuk mengatur dan mengelola data form
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || '',
        address: supplier.address || '',
        phone: supplier.phone || '',
        description: supplier.description || '',
        status: supplier.status || 'active',
        province_id: supplier.province_id || '',
        city_id: supplier.city_id || ''
    });

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Fungsi untuk mengubah data province dan memuat cities terkait
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setData("province_id", provinceId);

        if (provinceId) {
            setLoadingCities(true);
            try {
                const response = await fetch(`/admin/get-cities/${provinceId}`);
                const citiesData = await response.json();
                setCities(citiesData);
            } catch (error) {
                console.error("Error fetching cities:", error);
            } finally {
                setLoadingCities(false);
            }
        } else {
            setCities([]);
        }
    };

    // useEffect untuk menginisialisasi cities saat province_id berubah
    useEffect(() => {
        if (data.province_id) {
            handleProvinceChange({ target: { value: data.province_id } });
        }
    }, [data.province_id]);

    // Fungsi untuk submit data form
    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/suppliers/${supplier.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Supplier updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head>
                <title>Edit Supplier - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-12">
                            <div className="card border rounded shadow border-top-success">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <button onClick={handleBack} className="btn btn-sm btn-secondary">
                                        <i className="fa fa-arrow-left"></i> Back
                                    </button>
                                    <span className="font-weight-bold"><i className="bi bi-truck"></i> Edit Supplier</span>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Supplier Name */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Supplier Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Enter Supplier Name"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <div className="alert alert-danger">{errors.name}</div>}
                                        </div>

                                        {/* Phone Number */}
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

                                        {/* Address */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Address</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                placeholder="Enter Address"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                            />
                                            {errors.address && <div className="alert alert-danger">{errors.address}</div>}
                                        </div>

                                        {/* Description */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Description</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Enter Description (Optional)"
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            />
                                        </div>

                                        {/* Province Selection */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Province</label>
                                            <select
                                                className="form-select"
                                                value={data.province_id}
                                                onChange={handleProvinceChange}
                                            >
                                                <option value="">Select Province</option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.province_id && <div className="alert alert-danger">{errors.province_id}</div>}
                                        </div>

                                        {/* City Selection */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">City</label>
                                            <select
                                                className="form-select"
                                                value={data.city_id}
                                                onChange={e => setData('city_id', e.target.value)}
                                                disabled={loadingCities}
                                            >
                                                <option value="">Select City</option>
                                                {loadingCities ? (
                                                    <option disabled>Loading cities...</option>
                                                ) : (
                                                    cities.map((city) => (
                                                        <option key={city.id} value={city.id}>
                                                            {city.name}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                            {errors.city_id && <div className="alert alert-danger">{errors.city_id}</div>}
                                        </div>

                                        {/* Status */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Status</label>
                                            <select
                                                className="form-select"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            {errors.status && <div className="alert alert-danger">{errors.status}</div>}
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
