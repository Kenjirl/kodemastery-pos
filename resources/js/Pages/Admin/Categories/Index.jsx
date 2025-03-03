import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function CategoryIndex() {
    const { categories } = usePage().props; // Mendapatkan data categories dari props
    const [filterText, setFilterText] = useState(""); // State untuk filter pencarian

    // Filter categories berdasarkan input pencarian
    const filteredCategories = categories.data.filter((category) =>
        category.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan bisa mengembalikannya lagi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Panggil route delete
                router.delete(`/admin/categories/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Kategori telah dihapus.",
                            "success"
                        );
                        window.location.reload(); // Refresh halaman setelah berhasil menghapus
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus kategori.",
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
                <title>Kategori - EasyPOS</title>
            </Head>
            <AdminLayout>
                {/* Breadcrumb Navigation */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Kategori
                        </li>
                    </ol>
                </nav>

                {/* Header Section */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-list"></i> Kategori
                        </h3>
                    </div>
                </div>

                {/* Pencarian dan Tombol Tambah Kategori */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control me-2 w-25"
                                placeholder="Cari kategori"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            {hasAnyPermission(["categories.create"]) && (
                                <Link
                                    href="/admin/categories/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah Kategori
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabel Daftar Kategori */}
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
                                                <th>Nama</th>
                                                <th>Deskripsi</th>
                                                <th className="text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories.length > 0 ? (
                                                filteredCategories.map(
                                                    (category, index) => (
                                                        <tr key={category.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (categories.current_page -
                                                                        1) *
                                                                        categories.per_page}
                                                            </td>
                                                            <td>
                                                                {category.name}
                                                            </td>
                                                            <td>
                                                                {category.description}
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission(["categories.edit"]) && (
                                                                    <Link
                                                                        href={`/admin/categories/${category.id}/edit`}
                                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i> Edit
                                                                    </Link>
                                                                )}
                                                                {hasAnyPermission(["categories.delete"]) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                category.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-trash-fill"></i> Hapus
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center"
                                                    >
                                                        Tidak ada kategori ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Komponen Pagination */}
                                <Pagination links={categories.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
