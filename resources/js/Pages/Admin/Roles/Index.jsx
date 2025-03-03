import React from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from "../../../utils/hasAnyPermission";

export default function Dashboard() {
    const { roles } = usePage().props;

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
                router.delete(`/admin/roles/${id}`, {
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
                <title>Create Roles - EasyPOS</title>
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
                            <i className="bi bi-shield-lock"></i> Roles
                        </h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            {hasAnyPermission(["roles.index"]) && (
                                <Link
                                    href="/admin/roles/create"
                                    className="btn btn-success"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Add Role
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card border rounded">
                    <div className="card-body p-0">
                        <div className="table-responsive p-4">
                            <table className="table align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-center">
                                            No.
                                        </th>
                                        <th scope="col">Role Name</th>
                                        <th scope="col">Permissions</th>
                                        <th scope="col" className="text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.map((role, index) => (
                                        <tr key={role.id}>
                                            <td className="text-center">
                                                {index +
                                                    1 +
                                                    (roles.current_page - 1) *
                                                        roles.per_page}
                                            </td>
                                            <td>{role.name}</td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {role.permissions.map(
                                                        (permission, i) => (
                                                            <span
                                                                key={i}
                                                                className="badge bg-success text-white badge-lg"
                                                            >
                                                                {
                                                                    permission.name
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {hasAnyPermission([
                                                    "roles.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/roles/${role.id}/edit`}
                                                        className="btn btn-primary btn-md me-2"
                                                    >
                                                        <i className="bi bi-pencil"></i>{" "}
                                                        Edit
                                                    </Link>
                                                )}
                                                {hasAnyPermission([
                                                    "roles.delete",
                                                ]) && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                role.id
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={roles.links} />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
