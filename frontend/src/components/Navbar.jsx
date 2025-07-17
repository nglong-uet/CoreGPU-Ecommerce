import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar-custom">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <span className="logo-text">CoreGPU</span>
        </Link>
      </div>

      <ul className="navbar-center">
        <li><Link to="/">TRANG CHỦ</Link></li>
        <li><Link to="/products">SẢN PHẨM</Link></li>
        <li><Link to="/community">CỘNG ĐỒNG</Link></li>
        <li><Link to="/featured">NỔI BẬT</Link></li>
        <li><Link to="/reviews">ĐÁNH GIÁ</Link></li>
        <li><Link to="/support">HỖ TRỢ</Link></li>
      </ul>

      <div className="navbar-right">
        <img src="/images/search-icon.png" alt="Search" className="icon-img"/>
        <img src="/images/shopping-cart.png" alt="Cart" className="icon-img"/>
        <Link to="/auth">
          <img src="/images/user.png" alt="User" className="icon-img"/>
        </Link>
      </div>
    </nav>
  );
}
