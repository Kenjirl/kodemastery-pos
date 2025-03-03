import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function CustomerIndex() {
    const { customers } = usePage().props;
    const [filterText, setFilterText] = useState("");

    // Filter customers based on search input
    const filteredCustomers = customers.data.filter(
        (customer) =>
            (customer.name &&
                customer.name.toLowerCase().includes(filterText.toLowerCase())) ||
            (customer.phone &&
                customer.phone.toLowerCase().includes(filterText.toLowerCase()))
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Panggil route delete
                router.delete(`/admin/customers/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Customer telah dihapus.",
                            "success"
                        );
                        // Refresh halaman atau perbarui state jika diperlukan
                        window.location.reload(); // Refresh halaman
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus customer.",
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
                <title>Customers - EasyPOS</title>
            </Head>
            <AdminLayout>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Customers
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-person"></i> Customers
                        </h3>
                    </div>
                </div>

                {/* Search dan Add Customer */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control me-2 w-25"
                                placeholder="Search by Name or Phone"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            {hasAnyPermission(["customers.create"]) && (
                                <Link
                                    href="/admin/customers/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Add Customer
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabel Customers */}
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
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Gender</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCustomers.length > 0 ? (
                                                filteredCustomers.map(
                                                    (customer, index) => (
                                                        <tr key={customer.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (customers.current_page -
                                                                        1) *
                                                                        customers.per_page}
                                                            </td>
                                                            <td>
                                                                {customer.name ||
                                                                    "No name available"}
                                                            </td>
                                                            <td>
                                                                {customer.phone ||
                                                                    "No phone available"}
                                                            </td>
                                                            <td>
                                                                {customer.address ||
                                                                    "No address available"}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        customer.gender ===
                                                                        "male"
                                                                            ? "bg-primary"
                                                                            : customer.gender ===
                                                                              "female"
                                                                            ? "bg-danger"
                                                                            : "bg-secondary"
                                                                    }`}
                                                                >
                                                                    {customer.gender &&
                                                                    typeof customer.gender ===
                                                                        "string"
                                                                        ? customer.gender
                                                                              .charAt(
                                                                                  0
                                                                              )
                                                                              .toUpperCase() +
                                                                          customer.gender.slice(
                                                                              1
                                                                          )
                                                                        : "N/A"}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission([
                                                                    "customers.edit",
                                                                ]) && (
                                                                    <Link
                                                                        href={`/admin/customers/${customer.id}/edit`}
                                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i>{" "}
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {hasAnyPermission([
                                                                    "customers.delete",
                                                                ]) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                customer.id
                                                                            )
                                                                        }
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
                                                        colSpan="6"
                                                        className="text-center"
                                                    >
                                                        No customers found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Komponen Pagination */}
                                <Pagination links={customers.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
