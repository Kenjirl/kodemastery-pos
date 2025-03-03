import React, { useState, useEffect } from "react";
import { usePage, Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ProductStockCreate() {
    const { products, suppliers } = usePage().props;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: selectedProduct?.id || "",
        supplier_id: "",
        stock_quantity: 0,
        received_at: "",
    });

    useEffect(() => {
        if (products.length > 0) {
            setIsLoading(false);
        }
    }, [products]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedSupplier && selectedSupplier.status === "inactive") {
            Swal.fire({
                title: "Warning!",
                text: "Supplier yang dipilih tidak aktif. Apakah Anda ingin melanjutkan?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, continue",
                cancelButtonText: "No, cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    post("/admin/stocks", {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Success!",
                                text: "Product stock created successfully!",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            reset();
                        },
                    });
                }
            });
        } else {
            post("/admin/stocks", {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success!",
                        text: "Product stock created successfully!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head>
                <title>Add Product Stock - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="d-flex justify-content-center mt-5">
                    <div className="col-md-6 col-12">
                        <div className="card border-0 rounded shadow border-top-success">
                            <div className="card-header text-center">
                                <span className="font-weight-bold">
                                    <i className="bi bi-box-seam"></i> Add Product Stock
                                </span>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Product</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedProduct ? selectedProduct.name : ""}
                                                placeholder="Search for product"
                                                readOnly
                                                data-bs-toggle="modal"
                                                data-bs-target="#productModal"
                                            />
                                        </div>
                                        <input
                                            type="hidden"
                                            name="product_id"
                                            value={data.product_id}
                                            onChange={(e) => setData("product_id", e.target.value)}
                                        />
                                        {errors.product_id && <div className="alert alert-danger mt-2">{errors.product_id}</div>}
                                    </div>

                                    {selectedProduct && (
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Total Stock</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedProduct.stock_total?.total_stock || 0}
                                                disabled
                                            />
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Supplier</label>
                                        <select
                                            name="supplier_id"
                                            className="form-select"
                                            value={data.supplier_id}
                                            onChange={(e) => {
                                                setData("supplier_id", e.target.value);
                                                const selected = suppliers.find(
                                                    (supplier) => supplier.id === parseInt(e.target.value)
                                                );
                                                setSelectedSupplier(selected);
                                            }}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplier_id && <div className="alert alert-danger mt-2">{errors.supplier_id}</div>}

                                        {selectedSupplier && (
                                            <div
                                                className={`mt-2 ${
                                                    selectedSupplier.status === "active"
                                                        ? "text-success"
                                                        : "text-danger"
                                                }`}
                                            >
                                                <strong>Status:</strong> {selectedSupplier.status === "active" ? "Active" : "Inactive"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Stock Quantity</label>
                                        <input
                                            type="number"
                                            name="stock_quantity"
                                            className="form-control"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData("stock_quantity", e.target.value)}
                                            placeholder="Enter Stock Quantity"
                                        />
                                        {errors.stock_quantity && <div className="alert alert-danger mt-2">{errors.stock_quantity}</div>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Received Date</label>
                                        <input
                                            type="date"
                                            name="received_at"
                                            className="form-control"
                                            value={data.received_at}
                                            onChange={(e) => setData("received_at", e.target.value)}
                                        />
                                        {errors.received_at && <div className="alert alert-danger mt-2">{errors.received_at}</div>}
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="submit"
                                            className="btn btn-md btn-success me-2"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <div
                                                        className="spinner-border spinner-border-sm text-light me-2"
                                                        role="status"
                                                    >
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    loading...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save"></i> Save
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>

            {/* Modal for Product Selection */}
            <div
                className="modal fade"
                id="productModal"
                tabIndex="-1"
                aria-labelledby="productModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">
                                Select Product
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {isLoading ? (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive p-4">
                                    <table className="table align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Barcode</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.barcode}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.stock_total?.total_stock || 0}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                setData("product_id", product.id);
                                                                setSelectedProduct(product);
                                                            }}
                                                            className="btn btn-primary"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
