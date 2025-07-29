import React from "react";
import { Link } from "react-router-dom";
import "../style/ProductCard.css";

function ProductCard({ product }) {
  const imageUrl = product.thumbnail
  ? product.thumbnail.startsWith("http") || product.thumbnail.startsWith("/")
    ? product.thumbnail
    : `http://localhost:8080/${product.thumbnail}`
  : "/placeholder-image.jpg";

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
        <div className="product-card text-center p-3 shadow-sm rounded border h-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image mb-3"
          />
          <h5 className="product-name">{product.name}</h5>
          <p className="product-desc text-muted small">{product.description}</p>
          <p className="product-price text-danger fw-bold">
            {product.price?.toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
