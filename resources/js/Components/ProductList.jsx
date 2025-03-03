import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import ProductCard from "./ProductCard";

const ProductList = ({ products, loading, onSelectProduct }) => {


    return (
        <div
            className="row row-cols-2 row-cols-lg-3 g-3"
            style={{
                maxHeight: "350px",
                overflowY: "auto",
            }}
        >
            {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                        <div className="col" key={index}>
                            <Skeleton height={120} />
                        </div>
                    ))
                    : products.map((product, index) => (
                        <div className="col" key={index}>
                            <ProductCard
                                product={product}
                                onSelect={onSelectProduct}
                            />
                        </div>
                    ))}
        </div>
    );
};

export default ProductList;
