import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission"

export default function SupplierIndex() {
    const { suppliers } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredSuppliers = suppliers.data.filter(
        (supplier) =>
            (supplier.name.toLowerCase().includes(filterText.toLowerCase()) ||
                supplier.phone
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) &&
            (statusFilter ? supplier.status === statusFilter : true)
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
                router.delete(`/admin/suppliers/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Supplier has been deleted.",
                            "success"
                        );
                        window.location.reload();
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "There was a problem deleting the supplier.",
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
                <title>Suppliers - EasyPOS</title>
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
                            Suppliers
                        </li>
                    </ol>
                </nav>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-truck"></i> Suppliers
                        </h3>
                    </div>
                </div>
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

                            {hasAnyPermission(["suppliers.create"]) && (
                                <Link
                                    href="/admin/suppliers/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Add Supplier
                                </Link>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <select
                                className="form-select w-25"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
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
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Status</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSuppliers.length > 0 ? (
                                                filteredSuppliers.map(
                                                    (supplier, index) => (
                                                        <tr key={supplier.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (suppliers.current_page -
                                                                        1) *
                                                                        suppliers.per_page}
                                                            </td>
                                                            <td>
                                                                {supplier.name ||
                                                                    "No name available"}
                                                            </td>
                                                            <td>
                                                                {supplier.phone ||
                                                                    "No phone available"}
                                                            </td>
                                                            <td>
                                                                {supplier.address ||
                                                                    "No address available"}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        supplier.status ===
                                                                        "active"
                                                                            ? "bg-success"
                                                                            : "bg-secondary"
                                                                    }`}
                                                                >
                                                                    {supplier.status
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        supplier.status.slice(
                                                                            1
                                                                        )}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission(
                                                                    [
                                                                        "suppliers.edit",
                                                                    ]
                                                                ) && (
                                                                    <Link
                                                                        href={`/admin/suppliers/${supplier.id}/edit`}
                                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i>{" "}
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {hasAnyPermission(
                                                                    [
                                                                        "suppliers.delete",
                                                                    ]
                                                                ) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                supplier.id
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
                                                        No suppliers found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={suppliers.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
