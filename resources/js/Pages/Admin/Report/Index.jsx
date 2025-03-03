import React, { useState } from "react";
import { usePage, router, Head, Deferred } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ReportIndex() {
    const {
        transactions,
        start_date = "",
        end_date = "",
        errors,
    } = usePage().props;

    // State untuk menyimpan input tanggal
    const [startDate, setStartDate] = useState(start_date);
    const [endDate, setEndDate] = useState(end_date);

    // Ketika klik "Generate Report"
    const handleSubmit = (e) => {
        e.preventDefault();
        router.get("/admin/report/generate", {
            start_date: startDate,
            end_date: endDate,
        });
    };

    // Fungsi untuk menentukan warna badge berdasarkan metode pembayaran
    const getPaymentMethodBadge = (method) => {
        switch (method.toLowerCase()) {
            case "cash":
                return "success"; // Hijau
            case "online":
                return "primary"; // Biru
            default:
                return "secondary"; // Abu-abu untuk metode lain
        }
    };

    return (
        <>
            <Head>
                <title>Transaction Report - EasyPOS</title>
            </Head>

            <AdminLayout>
                <div className="container-fluid mt-4">
                    <h3 className="font-weight-bold mb-4">
                        <i className="bi bi-graph-up"></i> Transaction Report
                    </h3>

                    <div className="row">
                        {/* Kolom Filter */}
                        <div className="col-md-4 mb-4">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Filter Transactions</h5>
                                    <form onSubmit={handleSubmit}>
                                        {/* Start Date */}
                                        <div className="mb-3">
                                            <label
                                                htmlFor="start_date"
                                                className="form-label px-2"
                                            >
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                id="start_date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                            {errors?.start_date && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.start_date}
                                                </div>
                                            )}
                                        </div>

                                        {/* End Date */}
                                        <div className="mb-3">
                                            <label
                                                htmlFor="end_date"
                                                className="form-label px-2"
                                            >
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                id="end_date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                            {errors?.end_date && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.end_date}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                        >
                                            <i className="bi bi-file-earmark-arrow-down"></i>{" "}
                                            Generate Report
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Data */}
                        <div className="col-md-8">
                            <div className="card shadow">
                                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 text-white">
                                        <i className="bi bi-list-ul"></i>{" "}
                                        Transaction List
                                    </h5>
                                    <span>
                                        Total Transactions:{" "}
                                        {transactions?.length ?? 0}
                                    </span>
                                </div>

                                <div className="card-body p-0">
                                    <div
                                        className="table-responsive p-4"
                                        style={{
                                            maxHeight: "600px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <Deferred
                                            data="transactions"
                                            fallback={
                                                <div className="text-center my-4">
                                                    <div
                                                        className="spinner-border text-primary"
                                                        role="status"
                                                    >
                                                        <span className="visually-hidden">
                                                            Loading...
                                                        </span>
                                                    </div>
                                                    <p>Loading transactions...</p>
                                                </div>
                                            }
                                        >
                                            {transactions && transactions.length > 0 ? (
                                                <table className="table align-middle table-hover">
                                                    <thead className="bg-light text-white">
                                                        <tr>
                                                            <th>Customer</th>
                                                            <th>Transaction Date</th>
                                                            <th>Payment Method</th>
                                                            <th>Total Amount</th>
                                                            <th>Status</th>
                                                            <th>Quantity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {transactions.map((transaction) => (
                                                            <tr key={transaction.id}>
                                                                <td>
                                                                    {transaction.customer?.name || "Guest"}
                                                                </td>
                                                                <td>
                                                                    {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                                                                </td>
                                                                <td>
                                                                    <span className={`badge bg-${getPaymentMethodBadge(transaction.payment_method)}`}>
                                                                        {transaction.payment_method}
                                                                    </span>
                                                                </td>
                                                                <td className="text-end">
                                                                    {Number(transaction.total_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                                                </td>
                                                                <td className="text-center">
                                                                    <span
                                                                        className={`badge bg-${
                                                                            transaction.status === "success"
                                                                                ? "success"
                                                                                : transaction.status === "pending"
                                                                                ? "warning"
                                                                                : "danger"
                                                                        }`}
                                                                    >
                                                                        {transaction.status}
                                                                    </span>
                                                                </td>
                                                                <td className="text-end">
                                                                    {transaction.total_quantity || 0}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-center py-4">Transaksi tidak ditemukan.</p>
                                            )}
                                        </Deferred>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
