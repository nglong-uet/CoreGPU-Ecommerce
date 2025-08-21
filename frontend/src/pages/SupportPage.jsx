import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/SupportPage.css";
import usePageTitle from "../hooks/usePageTitle";

export default function SupportPage() {
  usePageTitle("Hỗ trợ | CoreGPU");

  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { q: "Thời gian bảo hành GPU bao lâu?", a: "Thông thường từ 24 đến 36 tháng, tùy hãng." },
    { q: "Có hỗ trợ trả góp không?", a: "Hiện tại chúng tôi có liên kết trả góp qua thẻ Visa, Mastercard, Momo." },
    { q: "Mất bao lâu để giao hàng?", a: "Trong 1-3 ngày tại Hà Nội, 3-5 ngày đối với tỉnh thành khác." },
  ];

  return (
    <div className="support-background py-3">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <img src="/icons/home.svg" alt="Home" className="icon-home" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span>Hỗ trợ</span>
        </div>

        <h2 className="title-main mb-4">TRUNG TÂM HỖ TRỢ</h2>

        <section className="mb-5">
          <h3 className="title-2">Câu hỏi thường gặp</h3>
          <div className="faq-list mt-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <span>{openIdx === idx ? "−" : "+"}</span>
                </div>
                {openIdx === idx && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="contact-support">
          <h3 className="title-2">Liên hệ trực tiếp</h3>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <div className="contact-box">
                <i className="fas fa-phone-alt"></i>
                <h5>Hotline</h5>
                <p>0395 656 183 (8:00 - 21:00)</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="contact-box">
                <i className="fas fa-envelope"></i>
                <h5>Email</h5>
                <p>coregpu@gpu.vn</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
