import React from "react";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function StockOpnameEdit({ stockOpname, products, errors }) {

    const { data, setData, put, processing, reset } = useForm({
        opname_date: stockOpname.opname_date || "",
        status: stockOpname.status || "pending",
        products: products.map((product) => {

            const detail = stockOpname.details.find((d) => d.product_id === product.id);
            return {
                product_id: product.id,
                physical_quantity: detail ? detail.physical_quantity : 0,
            };
        }),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/stock-opnames/${stockOpname.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Stock opname updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...data.products];
        updatedProducts[index][field] = value;
        setData("products", updatedProducts);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head>
                <title>Edit Stock Opname - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card border rounded shadow border-top-success">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <button
                                        onClick={handleBack}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        <i className="fa fa-arrow-left"></i> Back
                                    </button>
                                    <span className="font-weight-bold">
                                        <i className="bi bi-clipboard"></i> Edit Stock Opname
                                    </span>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Opname Date Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Opname Date</label>
                                            <input
                                                type="date"
                                                name="opname_date"
                                                className={`form-control ${
                                                    errors.opname_date ? "is-invalid" : ""
                                                }`}
                                                value={data.opname_date}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.opname_date && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.opname_date}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Field */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Status</label>
                                            <select
                                                name="status"
                                                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                                value={data.status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="canceled">Canceled</option>
                                            </select>

                                            {errors.status && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.status}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Fields */}
                                        <div className="mt-4">
                                            <h5 className="font-weight-bold">Products</h5>
                                            {data.products.map((productData, index) => {
                                                const product = products.find((p) => p.id === productData.product_id);
                                                return (
                                                    <div key={productData.product_id} className="form-group mt-3">
                                                        <label>{product?.name}</label>
                                                        <input
                                                            type="number"
                                                            value={data.products[index].physical_quantity}
                                                            className={`form-control ${
                                                                errors.products?.[index]?.physical_quantity ? "is-invalid" : ""
                                                            }`}
                                                            onChange={(e) =>
                                                                handleProductChange(index, "physical_quantity", e.target.value)
                                                            }
                                                            required
                                                        />
                                                        {errors.products?.[index]?.physical_quantity && (
                                                            <div className="alert alert-danger mt-2">
                                                                {errors.products[index].physical_quantity}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex justify-content-end mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-success me-2"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa fa-save"></i> Update
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={() => reset()}
                                            >
                                                <i className="fa fa-redo"></i> Reset
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
