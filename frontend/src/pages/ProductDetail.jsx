import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ProductDetail.css";
import { Link } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error("Không tìm thấy sản phẩm:", err);
        navigate("/not-found");
      });
  }, [id, navigate]);

  const handleBuyNow = () => {
    alert(`Đã mua ${quantity} sản phẩm: ${product.name}`);
  };

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ: ${product.name}`);
  };

  if (!product) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <>
      <Navbar />
      <div className="product-background py-4">
        <div className="container">
          <div className="breadcrumb mb-3">
            <Link to="/" className="breadcrumb-link">
              <img src="/icons/home.svg" alt="Home" className="icon-home" />
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="breadcrumb-link">Sản phẩm</Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>

          <div className="product-wrapper p-4 rounded shadow-sm bg-white">
            <div className="row">
              <div className="col-md-6">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="img-fluid rounded detail-image"
                />
              </div>
              <div className="col-md-6">
                <h2 className="mb-2">{product.name}</h2>
                <p className="text-muted">Hãng: {product.brand}</p>
                <p>{product.description}</p>
                <h4 className="text-danger fw-bold">
                  {product.price?.toLocaleString()} ₫
                </h4>

                <div className="d-flex align-items-center mt-3 mb-3">
                  <label htmlFor="quantity" className="me-2">Số lượng:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="form-control quantity-input"
                    style={{ width: "80px" }}
                  />
                </div>

                <div className="d-flex gap-3">
                  <button className="btn btn-outline-dark" onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                  </button>
                  <button className="btn btn-danger" onClick={handleBuyNow}>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetail;
