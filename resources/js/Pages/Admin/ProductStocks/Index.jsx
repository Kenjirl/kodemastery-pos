import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function ProductStockIndex() {
    const { productStocks = { data: [] }, suppliers = [] } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");

    const filteredStocks = productStocks.data.filter(
        (stock) =>
            stock.supplier.name
                .toLowerCase()
                .includes(filterText.toLowerCase()) &&
            (selectedSupplier
                ? stock.supplier.id === parseInt(selectedSupplier)
                : true)
    );


    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/stocks/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Product stock has been deleted.",
                            "success"
                        );
                        window.location.reload();
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "There was a problem deleting the product stock.",
                            "error"
                        );
                    },
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Stok Produk - EasyPOS</title>
            </Head>
            <AdminLayout>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Stock
                        </li>
                    </ol>
                </nav>
                <div className="row mb-3">
                    <div className="col-md-12 d-flex justify-content-between align-items-center">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-box-seam"></i> Stok Produk
                        </h3>
                        <div>
                          {hasAnyPermission(["stocks.create"]) && (
                            <Link
                                href="/admin/stocks/create"
                                className="btn btn-success"
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i>
                                Tambah Stok
                            </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12 d-flex justify-content-between align-items-center">
                        <input
                            type="text"
                            className="form-control me-2 w-25"
                            placeholder="Cari berdasarkan Nama Supplier"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                        <select
                            className="form-select w-auto"
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                        >
                            <option value="">Semua Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card rounded-2 border">
                            <div className="card-body p-0">
                                <div className="table-responsive p-4">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">No.</th>
                                                <th>Nama Produk</th>
                                                <th>Nama Supplier</th>
                                                <th>Jumlah Stok</th>
                                                <th>Tanggal Diterima</th>
                                                <th className="text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStocks.length > 0 ? (
                                                filteredStocks.map((stock, index) => (
                                                    <tr key={stock.id}>
                                                        <td className="text-center">
                                                            {index + 1 + (productStocks.current_page - 1) * productStocks.per_page}
                                                        </td>
                                                        <td>{stock.product.name || "No name available"}</td>
                                                        <td>{stock.supplier.name || "No supplier available"}</td>
                                                        <td>{stock.stock_quantity || 0}</td>
                                                        <td>{stock.received_at || "N/A"}</td>
                                                        <td className="text-center">
                                                        {hasAnyPermission(["stocks.delete"]) && (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm rounded"
                                                                onClick={() => handleDelete(stock.id)}
                                                            >
                                                                <i className="bi bi-trash-fill"></i> Hapus
                                                            </button>
                                                          )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        No product stocks found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={productStocks.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
