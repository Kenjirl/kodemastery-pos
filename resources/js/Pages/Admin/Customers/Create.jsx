import React from "react";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function CustomerCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone: "",
        address: "",
        email: "",
        gender: "pria",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/customers", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Customer created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
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
                <title>Create Customer - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card border rounded shadow border-top-success">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <button
                                        onClick={handleBack}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        <i className="fa fa-arrow-left"></i> Back
                                    </button>
                                    <span className="font-weight-bold">
                                        <i className="bi bi-person"></i> Add New
                                        Customer
                                    </span>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control ${
                                                    errors.name ? "is-invalid" : ""
                                                }`}
                                                placeholder="Enter Customer Name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            {errors.name && (
                                                <div className="alert alert-danger">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className={`form-control ${
                                                    errors.phone ? "is-invalid" : ""
                                                }`}
                                                placeholder="Enter Phone Number"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                            {errors.phone && (
                                                <div className="alert alert-danger">
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${
                                                    errors.email ? "is-invalid" : ""
                                                }`}
                                                placeholder="Enter Email Address (Optional)"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                            {errors.email && (
                                                <div className="alert alert-danger">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                className={`form-control ${
                                                    errors.address ? "is-invalid" : ""
                                                }`}
                                                placeholder="Enter Address (Optional)"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                            />
                                            {errors.address && (
                                                <div className="alert alert-danger">
                                                    {errors.address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                className="form-select"
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                            >
                                                <option value="pria">Pria</option>
                                                <option value="wanita">Wanita</option>
                                            </select>
                                            {errors.gender && (
                                                <div className="alert alert-danger">
                                                    {errors.gender}
                                                </div>
                                            )}
                                        </div>

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
                                            {/* Tombol Reset - Menggunakan type="button" */}
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
