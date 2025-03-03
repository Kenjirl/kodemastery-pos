import React, { useState } from 'react';

const ModalProduk = ({ products, onSelect, showModal, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className="modal fade"
            id="productModal"
            tabIndex="-1"
            aria-labelledby="productModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="productModalLabel">Select Product</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="col-md-4 mb-3">
                                    <div
                                        className="card h-100"
                                        onClick={() => {
                                            onSelect(product);
                                            onClose();
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        data-bs-dismiss="modal"
                                    >
                                        <img
                                            src={product.image}
                                            className="card-img-top"
                                            alt={product.name}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h6 className="card-title">{product.name}</h6>
                                            <p className="card-text text-muted mt-auto">
                                                Rp{product.selling_price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalProduk;
