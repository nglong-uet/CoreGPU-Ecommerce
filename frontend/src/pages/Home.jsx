import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import "../style/Home.css";
import Footer from "../components/Footer";

function Home() {

  const showcaseItems = [
    {
      name: "NVIDIA",
      desc: "Infinity Loop Cooling",
      image: "./images/nvidia.png",
    },
    {
      name: "AMD RADEON",
      desc: "The Next Frontier",
      image: "./images/amd.png",
    },
    {
      name: "ROG STRIX",
      desc: "Take Flight",
      image: "./images/rog.png",
    },
  ];

  const categories = [
  {
    name: "Gaming GPU",
    image: "./images/gaming.png",
    effectClass: "flame-effect",
    description: "Hiệu suất đỉnh cao cho game thủ.",
  },
  {
    name: "Creator GPU",
    image: "./images/creator.png",
    effectClass: "render-effect",
    description: "Tối ưu hoá cho thiết kế và dựng phim.",
  },
  {
    name: "GPU Second-hand",
    image: "./images/used-gpu.png",
    effectClass: "",
    description: "Giá tốt – Đã kiểm định kỹ lưỡng.",
  },
  {
    name: "Deal độc quyền",
    image: "./images/deal-combo.png",
    effectClass: "",
    description: "GPU tặng kèm màn hình giá tốt.",
  },
];

const handleViewMore = (item) => {
  console.log("View more:", item);
};

  return (
    <>
			<Navbar />
      <Banner />
      <section className="container mt-5">
        <h2 className="title-main">CARD ĐỒ HỌA</h2>
        <div className="text-center mb-3">
          <Link to="/products" className="view-all">XEM TẤT CẢ CARD ĐỒ HỌA &gt;</Link>
        </div>

        <div className="row">
          {showcaseItems.map((item, idx) => (
            <div key={idx} className="col-md-4 text-center mb-4">
              <div className="card-box">
                <img src={item.image} alt={item.name} className="card-image" />
                <div className="card-body">
                  <h4 className="card-title">{item.name}</h4>
                  <p className="card-desc">{item.desc}</p>
                  <button className="view-more" onClick={() => handleViewMore(item)}>
                    XEM THÊM &gt;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-5">
        <h2 className="title-2 mb-4">DANH MỤC SẢN PHẨM</h2>
        <div className="row">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-md-3 mb-4 d-flex">
              <div className="category-card text-center w-100">
                <div className="category-image-container">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`category-image ${cat.effectClass}`}
                  />
                  {cat.badge && <div className="badge-stamp">{cat.badge}</div>}
                  {cat.tag && <div className="combo-tag">{cat.tag}</div>}
                </div>
                <h5 className="mt-3">{cat.name}</h5>
                <p className="small">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="review-section mt-3 mb-4">
        <div className="container">
          <h2 className="title-2">REVIEW & ĐÁNH GIÁ</h2>

          <div className="row mt-4 mb-4">
            <div className="col-md-6 offset-md-3">
              <div className="video-wrapper">
                <div className="ratio ratio-16x9">
                  <iframe width="100%" height="315"
                    src="https://www.youtube.com/embed/sEfUJ0iOt0k"
                    title="RTX 5090 - Test in 15 Games | 1440p, 4K"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-center mt-2 fw-bold">RTX 5090 - Test in 15 Games | 1440p, 4K</p>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-4 d-flex">
              <div className="guide-box text-center w-100">
                <img src="./images/oc-guide.png" alt="OC Guide" className="guide-icon mb-3" />
                <h5>Hướng dẫn ép xung GPU an toàn</h5>
                <p>Học cách ép xung mà không làm giảm tuổi thọ GPU của bạn.</p>
              </div>
            </div>

            <div className="col-md-4 d-flex">
              <div className="guide-box text-center w-100">
                <img src="./images/nvidia-vs-amd.png" alt="NVIDIA vs AMD" className="guide-icon mb-3" />
                <h5>NVIDIA vs AMD: Chọn gì 2025?</h5>
                <p>So sánh chi tiết giúp bạn đưa ra lựa chọn tối ưu trong năm nay.</p>
              </div>
            </div>

            <div className="col-md-4 d-flex">
              <div className="guide-box text-center w-100">
                <img src="./images/gpu-health.png" alt="GPU Health" className="guide-icon mb-3" />
                <h5>Kiểm tra sức khỏe GPU của bạn</h5>
                <p>Hướng dẫn kiểm tra nhiệt độ, hiệu suất và độ ổn định GPU sau thời gian sử dụng.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-dark px-4 py-2">Xem tất cả đánh giá</button>
          </div>
        </div>
      </section>

      <Footer /> 
    </>
  );
}

export default Home;
