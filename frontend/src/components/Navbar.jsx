import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

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
        <li><Link to="/featured">NỔI BẬT</Link></li>
        <li><Link to="/reviews">ĐÁNH GIÁ</Link></li>
        <li><Link to="/support">HỖ TRỢ</Link></li>
      </ul>

      <div className="navbar-right">
        <img src="/images/search-icon.png" alt="Search" className="icon-img"/>
        <Link to="/cart">
          <img src="/images/shopping-cart.png" alt="Cart" className="icon-img"/>
        </Link>
        <div 
          className="user-icon-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link to={user ? "#" : "/auth"}>
            <img src="/images/user.png" alt="User" className="icon-img"/>
          </Link>
          
          {showDropdown && (
            <div className="user-dropdown">
              {user ? (
                <>
                  <Link to="/profile">Thông tin cá nhân</Link>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link to="/auth/login">Đăng nhập</Link>
                  <Link to="/auth/register">Đăng ký</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}