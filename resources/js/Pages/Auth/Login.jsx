import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors } = useForm({
        email: "",
        password: "",
    });

    const loginHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post("/login", {
            onFinish: () => setIsLoading(false),
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
            <div className="container-fluid">
                <div className="row">
                    {/* Bagian kiri (ilustrasi atau branding) */}
                    <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                        <div className="p-3 p-lg-5 text-center">
                            <img
                                src="https://is3.cloudhost.id/kodemastery/pos.webp"
                                alt="EasyPOS"
                                className="mb-5"
                            />
                            <h2 className="fw-bold">Welcome to EasyPOS</h2>
                            <p className="mb-0 h6 fw-light">
                                Everything You Need!
                            </p>
                        </div>
                    </div>

                    {/* Bagian kanan (form login) */}
                    <div className="col-12 col-lg-6 m-auto">
                        <div className="row my-5">
                            <div className="col-sm-10 col-xl-8 m-auto">
                                <span className="mb-0 fs-1">👋</span>
                                <h1 className="fs-2">EasyPOS!</h1>
                                <p className="lead mb-4">
                                    Silakan masuk dengan akun Anda.
                                </p>
                                <form onSubmit={loginHandler}>
                                    <div className="mb-4">
                                        <label className="form-label">
                                            Alamat Email *
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            placeholder="E-mail"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback d-block">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">
                                            Kata Sandi *
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback d-block">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="btn btn-primary mb-0 w-100 btn-md"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div
                                                className="spinner-border spinner-border-sm text-light"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        ) : (
                                            "Login"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
