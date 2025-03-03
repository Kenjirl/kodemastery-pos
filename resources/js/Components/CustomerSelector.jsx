import React from "react";

const CustomerSelector = ({ customers, selectedCustomer, onSelectCustomer, cashierName }) => {
    return (
        <div className="card shadow mb-4">
            <div className="card-body">
                <div className="row">
                    <div className="col-6">
                        <label className="form-label">Kasir</label>
                        <p className="form-control-plaintext">
                            {cashierName} {/* Tampilkan nama kasir yang diteruskan */}
                        </p>
                    </div>
                    <div className="col-6">
                        <label className="form-label">Customer</label>
                        <select
                            className="form-select"
                            onChange={(e) => onSelectCustomer(e.target.value || null)}
                            value={selectedCustomer || ""}
                        >
                            <option value="">Pilih Pelanggan (Opsional)</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSelector;
