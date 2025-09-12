import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/ReviewsPage.css";
import usePageTitle from "../hooks/usePageTitle";

export default function ReviewsPage() {
  usePageTitle("Đánh giá | CoreGPU");

  const reviews = [
    {
      title: "RTX 5090 - Test in 15 Games | 1440p, 4K",
      videoUrl: "https://www.youtube.com/embed/sEfUJ0iOt0k",
      desc: "Bài test chi tiết hiệu năng RTX 5090 trong nhiều tựa game.",
    },
    {
      title: "So sánh RX 7900 XT vs RX 7900 XTX vs RTX 4080 Super",
      videoUrl: "https://www.youtube.com/embed/incMfu2J5fg",
      desc: "Hiệu năng Gaming mạnh mẽ.",
    },
    {
      title: "RTX 4070 SUPER liệu CÓ ĐÁNG MUA ??",
      videoUrl: "https://www.youtube.com/embed/Moss6oc1klg",
      desc: "Kiểm tra khả năng làm việc lâu dài của RTX 4070 Super.",
    },
  ];

  const guides = [
    {
      img: "./images/oc-guide.png",
      title: "Hướng dẫn ép xung GPU an toàn",
      desc: "Tăng hiệu năng nhưng vẫn giữ tuổi thọ.",
    },
    {
      img: "./images/nvidia-vs-amd.png",
      title: "NVIDIA vs AMD 2025?",
      desc: "Phân tích chi tiết để chọn card phù hợp.",
    },
    {
      img: "./images/gpu-health.png",
      title: "Kiểm tra sức khỏe GPU",
      desc: "Cách theo dõi nhiệt độ & hiệu năng.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guideIndex, setGuideIndex] = useState(0);
  const [productReviews, setProductReviews] = useState([]);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = productReviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(productReviews.length / reviewsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/reviews/all")
      .then(res => setProductReviews(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    axios
      .get("http://localhost:8080/api/reviews/all")
      .then((res) => setProductReviews(res.data))
      .catch((err) => console.error(err));
  };

  const handleLike = async (id, userId) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/reviews/${id}/toggle-like?userId=${userId}`);
      const updatedReview = res.data;
      setProductReviews(prev => prev.map(r => (r.id === id ? updatedReview : r)));
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleDislike = async (id, userId) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/reviews/${id}/toggle-dislike?userId=${userId}`);
      const updatedReview = res.data;
      setProductReviews(prev => prev.map(r => (r.id === id ? updatedReview : r)));
    } catch (err) {
      console.error("Error disliking review:", err);
    }
  };

  const prevReview = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  const nextReview = () => {
    setCurrentIndex((prev) =>
      prev === reviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevGuide = () => {
    setGuideIndex((prev) => (prev === 0 ? guides.length - 1 : prev - 1));
  };

  const nextGuide = () => {
    setGuideIndex((prev) => (prev === guides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="review-background py-3">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <img src="/icons/home.svg" alt="Home" className="icon-home" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span>Đánh giá</span>
        </div>

        <h2 className="title-main mb-4">REVIEW & ĐÁNH GIÁ</h2>
        <div className="review-slider">
          <button className="slider-btn left" onClick={prevReview}>
            ❮
          </button>
          <div className="video-card slide active">
            <div className="ratio ratio-16x9">
              <iframe
                src={reviews[currentIndex].videoUrl}
                title={reviews[currentIndex].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h5 className="mt-2">{reviews[currentIndex].title}</h5>
            <p>{reviews[currentIndex].desc}</p>
          </div>
          <button className="slider-btn right" onClick={nextReview}>
            ❯
          </button>
        </div>

        <h3 className="title-2 mb-3">Bài viết hướng dẫn</h3>
        <div className="guide-slider">
          <button className="slider-btn left" onClick={prevGuide}>❮</button>
          <div className="guide-track">
            {[0, 1, 2].map((offset) => {
              const index = (guideIndex + offset) % guides.length;
              return (
                <div key={index} className="guides-box">
                  <div className="images-wrapper">
                    <img src={guides[index].img} alt={guides[index].title} />
                  </div>
                  <h5>{guides[index].title}</h5>
                  <p>{guides[index].desc}</p>
                </div>
              );
            })}
          </div>
          <button className="slider-btn right" onClick={nextGuide}>❯</button>
        </div>

        <h3 className="title-2 mt-5 mb-3">Đánh giá sản phẩm mới nhất</h3>
        <div className="product-reviews">
          {productReviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            currentReviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div>
                    <div className="review-user">
                      {r.userName}
                      <span className="review-product"> - {r.productName}</span>
                    </div>
                    <div className="review-date">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`fa-star ${i < r.rating ? "fas" : "far"}`}
                      ></i>
                    ))}
                  </div>
                </div>

                <div className="review-content">{r.comment}</div>

                <div className="review-footer">
                  <span
                    className="like-btn"
                    onClick={() => handleLike(r.id, userId)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="far fa-thumbs-up"></i> {r.likes || 0}
                  </span>
                  <span
                    className="dislike-btn"
                    onClick={() => handleDislike(r.id, userId)}
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                  >
                    <i className="far fa-thumbs-down"></i> {r.dislikes || 0}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
            «
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          
          <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
            »
          </button>
        </div>
      </div>
    </div>
  );
}
