import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function StockOpnameIndex() {
    const { stockOpnames } = usePage().props;

    const [filterText, setFilterText] = useState("");

    // Fungsi untuk mendapatkan kelas badge berdasarkan status
    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-warning text-dark';
            case 'success':
                return 'bg-success';
            case 'canceled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    // Filter berdasarkan tanggal atau status
    const filteredStockOpnames = stockOpnames.data.filter(
        (stockOpname) =>
            stockOpname.opname_date
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
            stockOpname.status.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Stock Opnames - EasyPOS</title>
            </Head>
            <AdminLayout>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Stock Opnames
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">Stock Opnames</h3>
                    </div>
                </div>

                {/* Search Bar dan Tombol Create */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control me-2 w-25"
                                placeholder="Search by Date or Status"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            <Link
                                href="/admin/stock-opnames/create"
                                className="btn btn-success"
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i>
                                Create New Stock Opname
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabel Stock Opnames */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="table-responsive p-4">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">No.</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStockOpnames.length > 0 ? (
                                                filteredStockOpnames.map((stockOpname, index) => (
                                                    <tr key={stockOpname.id}>
                                                        <td className="text-center">
                                                            {index +
                                                                1 +
                                                                (stockOpnames.current_page - 1) *
                                                                    stockOpnames.per_page}
                                                        </td>
                                                        <td>{stockOpname.opname_date}</td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadge(stockOpname.status)}`}>
                                                                {stockOpname.status}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <Link
                                                                href={`/admin/stock-opnames/${stockOpname.id}/edit`}
                                                                className="btn btn-outline-primary btn-sm me-2 rounded"
                                                            >
                                                                <i className="bi bi-pencil-fill"></i> Edit
                                                            </Link>
                                                            <Link
                                                                href={`/admin/stock-opnames/${stockOpname.id}`}
                                                                className="btn btn-outline-primary btn-sm me-2"
                                                            >
                                                                <i className="bi bi-eye-fill"></i> View Details
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No stock opnames found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Komponen Pagination */}
                                <Pagination links={stockOpnames.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
