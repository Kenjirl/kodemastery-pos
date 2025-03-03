import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const ShowStockOpname = () => {
    const { stockOpname } = usePage().props;
    const [filterText, setFilterText] = useState("");


    // Filter data berdasarkan nama produk dan quantity
    const filteredDetails = stockOpname.details.filter((detail) => {
        const productName = detail.product ? detail.product.name.toLowerCase() : "";
        const quantity = detail.physical_quantity ? String(detail.physical_quantity) : "";

        return (
            productName.includes(filterText.toLowerCase()) ||
            quantity.includes(filterText)
        );
    });

    return (
        <div className="container mt-4">
            <Head>
                <title>Detail Stock Opname</title>
            </Head>
            <AdminLayout>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/admin/stock-opnames">Stock Opnames</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Detail Stock Opname
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-clipboard"></i> Detail Stock Opname
                        </h3>
                        <div>
                            {/* Tombol Export */}
                            <a
                                href={`/admin/stock-opnames/${stockOpname.id}/export`}
                                className="btn btn-secondary"
                            >
                                <i className="bi bi-file-earmark-excel-fill me-2"></i>
                                Export to Excel
                            </a>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control me-2 w-25"
                                placeholder="Search by Product Name or Quantity"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            <Link href="/admin/stock-opnames" className="btn btn-primary">
                                Back to Stock Opnames
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="table-responsive p-4">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">No.</th>
                                                <th>Product Name</th>
                                                <th>Physical Quantity</th>
                                                <th>System Quantity</th>
                                                <th>Quantity Difference</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDetails.length > 0 ? (
                                                filteredDetails.map((detail, index) => {
                                                    // Menandai baris dengan selisih negatif
                                                    const isNegativeDifference = detail.quantity_difference < 0;

                                                    return (
                                                        <tr
                                                            key={detail.id}
                                                            className={isNegativeDifference ? "table-danger" : ""}
                                                        >
                                                            <td className="text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td>{detail.product ? detail.product.name : "No product"}</td>
                                                            <td>{detail.physical_quantity || 0}</td>
                                                            <td>
                                                                {detail.stock_total
                                                                    ? detail.stock_total.total_stock
                                                                    : 0}
                                                            </td>
                                                            <td>{detail.quantity_difference || 0}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No details found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </div>
    );
};

export default ShowStockOpname;
