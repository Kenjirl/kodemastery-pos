import React, { useState } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function UserIndex() {
    const { users } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(filterText.toLowerCase()) ||
            user.email.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/users/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Dihapus!", "Data telah dihapus.", "success");
                    },
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Users - EasyPOS</title>
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
                            Users
                        </li>
                    </ol>
                </nav>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <h3 className="font-weight-bold">
                            <i className="bi bi-people-fill"></i> Users
                        </h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control me-2 w-25"
                                placeholder="Search by Name or Email"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            {hasAnyPermission(["users.create"]) && (
                                <Link
                                    href="/admin/users/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Add User
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
                                    <table className="table align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="text-center"
                                                >
                                                    No.
                                                </th>
                                                <th scope="col">Name</th>
                                                <th scope="col">
                                                    Email Address
                                                </th>
                                                <th scope="col">Role</th>
                                                <th
                                                    scope="col"
                                                    className="text-center"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(
                                                (user, index) => (
                                                    <tr key={user.id}>
                                                        <td className="text-center">
                                                            {index +
                                                                1 +
                                                                (users.current_page -
                                                                    1) *
                                                                    users.per_page}
                                                        </td>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            {user.roles.map(
                                                                (role, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="badge bg-success me-2"
                                                                    >
                                                                        {
                                                                            role.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            {hasAnyPermission([
                                                                "users.edit",
                                                            ]) && (
                                                                <Link
                                                                    href={`/admin/users/${user.id}/edit`}
                                                                    className="btn btn-primary btn-md me-2"
                                                                >
                                                                    <i className="bi bi-pencil"></i>{" "}
                                                                    Edit
                                                                </Link>
                                                            )}
                                                            {hasAnyPermission([
                                                                "users.delete",
                                                            ]) && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    className="btn btn-danger btn-md"
                                                                >
                                                                    <i className="bi bi-trash"></i>{" "}
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={users.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
