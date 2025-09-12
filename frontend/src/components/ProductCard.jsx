import React from "react";
import { Link } from "react-router-dom";
import "../style/ProductCard.css";
import axios from "axios";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const imageUrl = product.thumbnail
    ? product.thumbnail.startsWith("http") || product.thumbnail.startsWith("/")
      ? product.thumbnail
      : `http://localhost:8080/${product.thumbnail}`
    : "/placeholder-image.jpg";

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Vui lòng đăng nhập trước khi mua hàng");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      });

      let currentQty = parseInt(localStorage.getItem("cartQuantity") || "0");
      localStorage.setItem("cartQuantity", currentQty + 1);
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Đã thêm vào giỏ hàng", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Lỗi thêm giỏ:", err);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="product-card text-center p-3 shadow-sm rounded border h-100">
        <div className="image-wrapper position-relative">
          <Link to={`/products/${product.id}`}>
            <img src={imageUrl} alt={product.name} className="product-image mb-3" />
          </Link>
          <button
            className="add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>

        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
          <h5 className="product-name">{product.name}</h5>
          <p className="product-desc text-muted small">{product.description}</p>
          <p className="product-price text-danger fw-bold">
            {product.price?.toLocaleString("vi-VN")} ₫
          </p>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
