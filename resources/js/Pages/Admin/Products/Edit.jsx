import React from "react";
import { Head, usePage, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ProductEdit() {
    const { product, categories, units } = usePage().props;

    const { data, setData, errors } = useForm({
        name: product.name,
        barcode: product.barcode,
        category_id: product.category_id,
        unit_id: product.unit_id,
        selling_price: product.selling_price,
        image: null,
    });

    const updateProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('barcode', data.barcode);
        formData.append('category_id', data.category_id);
        formData.append('unit_id', data.unit_id);
        formData.append('selling_price', data.selling_price);
        if (data.image) {
            formData.append('image', data.image);
        }
        formData.append('_method', 'PUT');

        router.post(`/admin/products/${product.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Data updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
        });
    };

    return (
        <>
            <Head>
                <title>Edit Product - EasyPOS</title>
            </Head>
            <AdminLayout>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-primary">
                            <div className="card-header">
                                <span className="font-weight-bold">
                                    <i className="fa fa-pencil-square"></i> Edit Product
                                </span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={updateProduct} encType="multipart/form-data">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Product Image</label>
                                                {product.image && (
                                                    <div className="mb-2">
                                                        <img
                                                            src={`${product.image}`}
                                                            alt={product.name}
                                                            className="img-thumbnail"
                                                            style={{ maxWidth: '200px' }}
                                                        />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => setData('image', e.target.files[0])}
                                                />
                                                {errors.image && (
                                                    <div className="alert alert-danger">
                                                        {errors.image}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Barcode Input */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Barcode</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.barcode ? 'is-invalid' : ''}`}
                                                    value={data.barcode}
                                                    onChange={(e) => setData('barcode', e.target.value)}
                                                    placeholder="Enter Barcode"
                                                    required
                                                />
                                                {errors.barcode && (
                                                    <div className="invalid-feedback">
                                                        {errors.barcode}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name Input */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Product Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Enter Product Name"
                                                    required
                                                />
                                                {errors.name && (
                                                    <div className="invalid-feedback">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Kolom kedua */}
                                        <div className="col-md-6">
                                            {/* Category Select */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Category</label>
                                                <select
                                                    className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                                                    value={data.category_id}
                                                    onChange={(e) => setData('category_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && (
                                                    <div className="invalid-feedback">
                                                        {errors.category_id}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Unit Select */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Unit</label>
                                                <select
                                                    className={`form-select ${errors.unit_id ? 'is-invalid' : ''}`}
                                                    value={data.unit_id}
                                                    onChange={(e) => setData('unit_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Unit</option>
                                                    {units.map(unit => (
                                                        <option key={unit.id} value={unit.id}>
                                                            {unit.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.unit_id && (
                                                    <div className="invalid-feedback">
                                                        {errors.unit_id}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selling Price Input */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Selling Price</label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.selling_price ? 'is-invalid' : ''}`}
                                                    value={data.selling_price}
                                                    onChange={(e) => setData('selling_price', e.target.value)}
                                                    placeholder="Enter Selling Price"
                                                    required
                                                />
                                                {errors.selling_price && (
                                                    <div className="invalid-feedback">
                                                        {errors.selling_price}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-md btn-success me-2">
                                            <i className="fa fa-save"></i> Update
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
