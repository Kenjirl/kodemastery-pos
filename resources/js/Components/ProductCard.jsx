
import React from 'react';

const ProductCard = ({ product, onSelect }) => {
    return (
        <div
            className="card h-100 shadow mb-2"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(product)}
        >
            <img
                src={product.image}
                className="card-img-top rounded-3"
                alt={product.name}
            />
            <div className="card-body d-flex flex-column p-2">
                <h6 className=" text-truncate" >
                    {product.name}
                </h6>
                <p className="text-muted mt-auto">
                    Rp{product.selling_price.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
