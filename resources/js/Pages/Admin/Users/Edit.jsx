import React, { useState } from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function UserEdit() {
    const { errors, roles, user } = usePage().props;

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, put, processing, reset } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        roles: user.roles.length > 0 ? user.roles[0].name : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...data };
        if (!payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        put(`/admin/users/${user.id}`, {
            data: payload,
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "User updated successfully!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Failed!",
                    text: "There was an error updating the user.",
                    icon: "error",
                    showConfirmButton: true,
                });
            },
        });
    };

    return (
        <>
            <Head>
                <title>Edit User - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="container mt-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card border-0 rounded shadow-sm border-top-success">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        <i className="bi bi-arrow-left"></i> Back
                                    </button>
                                    <strong>
                                        <i className="bi bi-people"></i> Edit User
                                    </strong>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Full Name */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${
                                                    errors.name ? "is-invalid" : ""
                                                }`}
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData("name", e.target.value)
                                                }
                                                placeholder="Enter Full Name"
                                            />
                                            {errors.name && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Email Address */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                className={`form-control ${
                                                    errors.email ? "is-invalid" : ""
                                                }`}
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                placeholder="Enter Email Address"
                                            />
                                            {errors.email && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Password
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className={`form-control ${
                                                        errors.password
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter Password (leave blank to keep current password)"
                                                />
                                                <span
                                                    className="input-group-text"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <i
                                                        className={
                                                            showPassword
                                                                ? "bi bi-eye-slash"
                                                                : "bi bi-eye"
                                                        }
                                                    ></i>
                                                </span>
                                            </div>
                                            {errors.password && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>

                                        {/* Password Confirmation */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                Password Confirmation
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type={
                                                        showPasswordConfirmation
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className={`form-control ${
                                                        errors.password_confirmation
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Confirm Password"
                                                />
                                                <span
                                                    className="input-group-text"
                                                    onClick={() =>
                                                        setShowPasswordConfirmation(
                                                            !showPasswordConfirmation
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <i
                                                        className={
                                                            showPasswordConfirmation
                                                                ? "bi bi-eye-slash"
                                                                : "bi bi-eye"
                                                        }
                                                    ></i>
                                                </span>
                                            </div>
                                            {errors.password_confirmation && (
                                                <div className="alert alert-danger mt-2">
                                                    {
                                                        errors.password_confirmation
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        {/* Roles */}
                                        <div className="mb-3">
                                            <label className="fw-bold">
                                                Roles
                                            </label>
                                            <div className="mt-2">
                                                {roles.map((role) => (
                                                    <div
                                                        className="form-check form-check-inline"
                                                        key={role.id}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="roles"
                                                            value={role.name}
                                                            className="form-check-input"
                                                            id={`role-${role.id}`}
                                                            checked={
                                                                data.roles ===
                                                                role.name
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "roles",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`role-${role.id}`}
                                                        >
                                                            {role.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.roles && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.roles}
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit and Reset Buttons */}
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
                                                            <span className="visually-hidden">
                                                                Loading...
                                                            </span>
                                                        </div>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-save"></i>{" "}
                                                        Update
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={() => reset()}
                                            >
                                                <i className="bi bi-arrow-counterclockwise"></i>{" "}
                                                Reset
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
