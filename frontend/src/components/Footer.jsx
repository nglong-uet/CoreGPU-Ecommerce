import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-section mt-5">
      <div className="container">
        <div className="row">

          <div className="col-md-3 col-sm-6 footer-col">
            <h5>Hỗ trợ</h5>
            <ul>
              <li>Live Chat</li>
              <li>Hotline: 0395 656 183</li>
              <li>Email: coregpu@gpu.vn</li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 footer-col">
            <h5>Chính sách</h5>
            <ul>
              <li>Bảo hành</li>
              <li>Thu cũ đổi mới</li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 footer-col">
            <h5>Cộng đồng</h5>
            <ul>
              <li><a href="discord-channel">Discord</a></li>
              <li><a href="facebook-group">Facebook Group</a></li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 footer-col">
            <h5>Đăng ký nhận tin</h5>
            <input
              type="email"
              placeholder="Email của bạn"
              className="form-control mb-2"
            />
            <button className="btn btn-danger btn-sm mb-2">Đăng ký</button>
            <div className="social-icons">
              <div className="tiktok-icon">
                <img src="/icons/tiktok.svg" alt="TikTok" />
              </div>
              <div className="youtube-icon">
                <img src="/icons/youtube.svg" alt="YouTube" />
              </div>
              <div className="facebook-icon">
                <img src="/icons/facebook.svg" alt="Facebook" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
