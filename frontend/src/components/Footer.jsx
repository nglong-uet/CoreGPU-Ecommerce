import "../style/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-col">
              <h5 className="footer-title">Hỗ trợ khách hàng</h5>
              <ul className="footer-links">
                <li><i className="fas fa-comment-dots"></i> Live Chat 24/7</li>
                <li><i className="fas fa-phone-alt"></i> Hotline: 0395 656 183</li>
                <li><i className="fas fa-envelope"></i> Email: coregpu@gpu.vn</li>
                <li><i className="fas fa-question-circle"></i> Hướng dẫn mua hàng</li>
              </ul>
            </div>

            <div className="footer-col">
              <h5 className="footer-title">Chính sách</h5>
              <ul className="footer-links">
                <li><i className="fas fa-shield-alt"></i> Bảo hành</li>
                <li><i className="fas fa-sync-alt"></i> Thu cũ đổi mới</li>
                <li><i className="fas fa-truck"></i> Giao hàng & thanh toán</li>
                <li><i className="fas fa-undo"></i> Đổi trả & hoàn tiền</li>
              </ul>
            </div>

            <div className="footer-col">
              <h5 className="footer-title">Cộng đồng</h5>
              <ul className="footer-links">
                <li><a href="discord-channel"><i className="fab fa-discord"></i> Discord</a></li>
                <li><a href="facebook-group"><i className="fab fa-facebook"></i> Facebook Group</a></li>
                <li><a href="youtube-channel"><i className="fab fa-youtube"></i> YouTube</a></li>
                <li><a href="tiktok-channel"><i className="fab fa-tiktok"></i> TikTok</a></li>
              </ul>
            </div>

            <div className="footer-col newsletter-col">
              <h5 className="footer-title">Đăng ký nhận tin</h5>
              <p className="newsletter-desc">Nhận thông tin khuyến mãi và cập nhật sản phẩm mới nhất</p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="form-input"
                />
                <button className="subscribe-btn">
                  <i className="fas fa-paper-plane"></i> Đăng ký
                </button>
              </div>
              <div className="social-icons">
                <a href="https://www.tiktok.com/vi-VN/" className="social-icon" aria-label="TikTok">
                  <i className="fab fa-tiktok"></i>
                </a>
                <a href="https://www.youtube.com/" className="social-icon" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.facebook.com/" className="social-icon" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com/" className="social-icon" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright">
              © 2025 CoreGPU. Tất cả quyền được bảo lưu.
            </div>
            <div className="payment-methods">
              <img src="/icons/visa.svg" alt="Visa" />
              <img src="/icons/mastercard.svg" alt="Mastercard" />
              <img src="/icons/momo.svg" alt="Momo" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}