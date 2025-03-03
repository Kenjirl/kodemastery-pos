import React from "react";
import DataTable from "react-data-table-component";
import { rupiah } from "../utils/rupiah";

const Cart = ({ cartItems, onDelete }) => {
    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            width: "70px",
        },
        {
            name: "Product Item",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Qty",
            selector: (row) => row.quantity,
            sortable: true,
            right: true,
        },
        {
            name: "Total",
            selector: (row) => rupiah(row.total_price),
            sortable: true,
            right: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(row.id)}
                >
                    <i className="bi bi-trash"></i> Delete
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={cartItems}
            pagination
            highlightOnHover
            striped
            noHeader
            responsive
        />
    );
};

export default Cart;
