import React from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function UnitIndex() {
    const { units } = usePage().props;

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan bisa membatalkan tindakan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/units/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Dihapus!", "Unit telah dihapus.", "success");
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus unit.",
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
                <title>Units - EasyPOS</title>
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
                            Units
                        </li>
                    </ol>
                </nav>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-tags-fill"></i> Units
                        </h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-end align-items-center">
                        {hasAnyPermission(["units.create"]) && (
                            <Link
                                href="/admin/units/create"
                                className="btn btn-success"
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i>
                                Tambah Unit
                            </Link>
                         )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 rounded-3">
                            <div className="card-body p-0">
                                <div className="table-responsive p-4">
                                    <table className="table align-middle table-hover">
                                        <thead className="bg-light text-white">
                                            <tr>
                                                <th className="text-center">
                                                    No.
                                                </th>
                                                <th>Nama</th>
                                                <th className="text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {units.data.length > 0 ? (
                                                units.data.map((unit, index) => (
                                                    <tr
                                                        key={unit.id}
                                                        className="hover-bg-light"
                                                    >
                                                        <td className="text-center">
                                                            {index +
                                                                1 +
                                                                (units.current_page -
                                                                    1) *
                                                                    units.per_page}
                                                        </td>
                                                        <td>
                                                            {unit.name ||
                                                                "Nama tidak tersedia"}
                                                        </td>
                                                        <td className="text-center">
                                                        {hasAnyPermission(["units.edit"]) && (
                                                            <Link
                                                                href={`/admin/units/${unit.id}/edit`}
                                                                className="btn btn-outline-primary btn-sm me-2 rounded-2 shadow-sm"
                                                            >
                                                                <i className="bi bi-pencil-fill"></i>{" "}
                                                                Edit
                                                            </Link>
                                                             )}
                                                          {hasAnyPermission(["units.delete"]) && (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm rounded-2 shadow-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        unit.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-trash-fill"></i>{" "}
                                                                Hapus
                                                            </button>
                                                               )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center"
                                                    >
                                                        Tidak ada unit ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={units.links} />{" "}
                                {/* Komponen Pagination */}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
