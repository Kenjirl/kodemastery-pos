import React, { useState } from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function SupplierCreate() {
    const { provinces } = usePage().props;

    const [cities, setCities] = useState([]);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setData("province_id", provinceId);

        if (provinceId) {
            try {
                const response = await fetch(`/admin/get-cities/${provinceId}`);
                const citiesData = await response.json();
                setCities(citiesData);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        } else {
            setCities([]);
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
        phone: '',
        description: '',
        status: 'active',
        province_id: '',
        city_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/admin/suppliers', {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Supplier created successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                reset();
            },
        });
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head>
                <title>Create Supplier - EasyPOS</title>
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
                                    <span className="font-weight-bold"><i className="bi bi-truck"></i> Add New Supplier</span>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Supplier Name */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Supplier Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Enter Supplier Name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            {errors.name && (
                                                <div className="alert alert-danger">{errors.name}</div>
                                            )}
                                        </div>

                                        {/* Phone Number */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                placeholder="Enter Phone Number"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                            {errors.phone && (
                                                <div className="alert alert-danger">{errors.phone}</div>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                placeholder="Enter Address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                            />
                                            {errors.address && (
                                                <div className="alert alert-danger">{errors.address}</div>
                                            )}
                                        </div>

                                        {/* Province Selection */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Province</label>
                                            <select
                                                name="province_id"
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
                                        </div>

                                        {/* City Selection */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">City</label>
                                            <select
                                                name="city_id"
                                                className="form-select"
                                                value={data.city_id}
                                                onChange={(e) => setData('city_id', e.target.value)}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((city) => (
                                                    <option key={city.id} value={city.id}>
                                                        {city.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Status */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Status</label>
                                            <select
                                                name="status"
                                                className="form-select"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            {errors.status && (
                                                <div className="alert alert-danger">{errors.status}</div>
                                            )}
                                        </div>

                                        {/* Submit and Reset buttons */}
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
                                                        <i className="fa fa-save"></i> Save
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-warning"
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
                </div>
            </AdminLayout>
        </>
    );
}
