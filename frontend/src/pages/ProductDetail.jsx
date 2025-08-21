import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/ProductDetail.css";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import usePageTitle from "../hooks/usePageTitle";

function ProductDetail() {
  usePageTitle("Chi tiết sản phẩm | CoreGPU");

  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [visibleReviews, setVisibleReviews] = useState(3);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/reviews/products/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Lỗi khi tải đánh giá:", err));
  }, [id]);

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Vui lòng đăng nhập trước");
      navigate("/auth/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/reviews/add", {
        userId: user.id,
        productId: product.id,
        rating,
        comment: newReview,
      });

      setReviews([...reviews, res.data]);
      setNewReview("");
      setRating(5);
      toast.success("Đánh giá đã được gửi");
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      toast.error("Không thể gửi đánh giá");
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        const productData = res.data;
        setProduct(productData);
        setMainImage(productData.thumbnail || (productData.images?.[0] || ""));
      })
      .catch((err) => {
        console.error("Không tìm thấy sản phẩm:", err);
        navigate("/not-found");
      });
  }, [id, navigate]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Vui lòng đăng nhập trước");
      navigate("/auth/login");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: quantity,
      });
      localStorage.setItem("cartUpdated", Date.now());
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error("Lỗi thêm vào giỏ:", err);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  const handleBuyNow = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Vui lòng đăng nhập trước");
      navigate("/auth/login");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: quantity,
      });
      localStorage.setItem("cartUpdated", Date.now());
      toast.success("Sản phẩm đã được thêm. Chuyển đến giỏ hàng...");
      setTimeout(() => navigate("/cart"), 1000);
    } catch (err) {
      console.error("Lỗi khi mua hàng:", err);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  if (!product) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <>
      <div className="product-background py-3">
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

          <div className="product-wrapper p-4 rounded">
            <div className="row">
              <div className="col-md-1 thumbnail-container d-flex flex-column align-items-center">
                {product.images?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index}`}
                    className={`img-thumbnail ${mainImage === url ? "active-thumbnail" : ""}`}
                    onClick={() => setMainImage(url)}
                  />
                ))}
              </div>
              
              <div className="col-md-5 main-image-container d-flex align-items-center">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="img-fluid rounded detail-image"
                />
              </div>

              <div className="col-md-6">
                <h2 className="mb-2">{product.name}</h2>
                <table className="table product-table mb-4">
                  <tbody>
                    <tr>
                      <th>Hãng</th>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <th>Tình trạng</th>
                      <td>{product.product_condition}</td>
                    </tr>
                    <tr>
                      <th>Bộ nhớ</th>
                      <td>{product.memory}</td>
                    </tr>
                    <tr>
                      <th>Bus</th>
                      <td>{product.bus}</td>
                    </tr>
                    <tr>
                      <th>Cổng kết nối</th>
                      <td>{product.connector}</td>
                    </tr>
                    <tr>
                      <th>Bảo hành</th>
                      <td>{product.warranty}</td>
                    </tr>
                    <tr>
                      <th>Mô tả</th>
                      <td>{product.description}</td>
                    </tr>
                  </tbody>
                </table>
                
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

          <div className="product-review mt-5">
            <h3 className="review-title">Đánh giá sản phẩm</h3>

            {reviews.length === 0 ? (
              <p className="text-muted">Chưa có đánh giá nào.</p>
            ) : (
              <div className="review-list">
                {reviews.slice(0, visibleReviews).map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <strong>{r.userName || "Người dùng ẩn danh"}</strong>
                      <span className="review-rating">{"⭐".repeat(r.rating)}</span>
                    </div>
                    <p className="review-comment">{r.comment}</p>
                    <small className="text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
                {visibleReviews < reviews.length && (
                  <button
                    className="btn btn-link p-0 mt-2"
                    onClick={() => setVisibleReviews(visibleReviews + 3)}
                  >
                    Xem thêm
                  </button>
                )}
              </div>
            )}

            <div className="review-form mt-4">
              <h5>Viết đánh giá của bạn</h5>
              <div className="mb-3">
                <label className="d-block mb-2">Chọn số sao:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? "filled" : ""}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Nhập đánh giá..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              ></textarea>
              <button className="btn btn-primary" onClick={handleSubmitReview}>
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail; 