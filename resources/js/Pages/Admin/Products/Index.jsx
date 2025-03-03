import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Barcode from "react-barcode";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function ProductIndex() {
    const { products } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredProducts = products.data.filter((product) =>
        product.name && product.name.toLowerCase().includes(filterText.toLowerCase())
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
                router.delete(`/admin/products/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Produk has been deleted.",
                            "success"
                        );
                        window.location.reload();
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "There was a problem deleting the category.",
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
                <title>Products - EasyPOS</title>
            </Head>
            <AdminLayout>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Products
                        </li>
                    </ol>
                </nav>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-box-seam-fill"></i> Products
                        </h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control me-2 w-25"
                                placeholder="Cari berdasarkan Nama"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)} // Mengubah filterText saat input berubah
                            />
                              {hasAnyPermission(["products.create"]) && (
                            <Link
                                href="/admin/products/create"
                                className="btn btn-success"
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i>
                                Tambah Produk
                            </Link>
                              )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="table-responsive p-4">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">
                                                    No.
                                                </th>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Barcode</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map(
                                                    (product, index) => (
                                                        <tr key={product.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (products.current_page -
                                                                        1) *
                                                                        products.per_page}
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    width="50"
                                                                />
                                                            </td>
                                                            <td>
                                                                {product.name ||
                                                                    "Nama tidak tersedia"}
                                                            </td>
                                                            <td>
                                                                <Barcode
                                                                    value={
                                                                        product.barcode
                                                                    }
                                                                    width={1}
                                                                    height={30}
                                                                    fontSize={
                                                                        12
                                                                    }
                                                                    displayValue={
                                                                        false
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                {product
                                                                    .category
                                                                    .name ||
                                                                    "Tidak ada kategori"}
                                                            </td>
                                                            <td>{`Rp ${product.selling_price}`}</td>
                                                            <td>
                                                                {product.stock_total
                                                                    ? product
                                                                          .stock_total
                                                                          .total_stock
                                                                    : 0}
                                                            </td>
                                                            <td className="text-center">
                                                            {hasAnyPermission(["products.edit"]) && (
                                                                <Link
                                                                    href={`/admin/products/${product.id}/edit`}
                                                                    className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    aria-label={`Edit product: ${product.name}`}
                                                                >
                                                                    <i className="bi bi-pencil-fill"></i>{" "}
                                                                    Edit
                                                                </Link>
                                                                      )}

                                                            {hasAnyPermission(["products.delete"]) && (
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm rounded"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    aria-label={`Delete product: ${product.name}`}
                                                                >
                                                                    <i className="bi bi-trash-fill"></i>{" "}
                                                                    Delete
                                                                </button>
                                                                   )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="8"
                                                        className="text-center"
                                                    >
                                                        Tidak ada produk ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={products.links} />{" "}
                                {/* Komponen Pagination */}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
