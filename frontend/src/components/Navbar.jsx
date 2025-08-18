import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import "../style/Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);
    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateCartQuantity = () => {
      const qty = parseInt(localStorage.getItem("cartQuantity") || "0");
      setCartQuantity(qty);
    };

    updateCartQuantity();
    
    const interval = setInterval(updateCartQuantity, 500);
    window.addEventListener("storage", updateCartQuantity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateCartQuantity);
    };
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }, [navigate]);

  const handleSearchSubmit = useCallback((e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchInput(false);
    }
  }, [searchQuery, navigate]);

  const handleSearchClick = useCallback(() => {
    setShowSearchInput(prev => !prev);
    if (showSearchInput && searchQuery.trim()) {
      handleSearchSubmit(new Event('submit'));
    }
  }, [showSearchInput, searchQuery, handleSearchSubmit]);

  const navLinks = [
    { path: "/", text: "TRANG CHỦ" },
    { path: "/products", text: "SẢN PHẨM" },
    { path: "/featured", text: "NỔI BẬT" },
    { path: "/reviews", text: "ĐÁNH GIÁ" },
    { path: "/community", text: "CỘNG ĐỒNG" },
    { path: "/support", text: "HỖ TRỢ" }
  ];

  return (
    <nav className="navbar-custom">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <span className="logo-text">CoreGPU</span>
        </Link>
      </div>

      <ul className="navbar-center">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.text}</Link>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <div className="search-container" ref={searchRef}>
          {showSearchInput ? (
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button type="submit" className="search-submit-button">
                <img src="/images/search-icon.png" alt="Search" className="icon-img" />
              </button>
            </form>
          ) : (
            <img 
              src="/images/search-icon.png" 
              alt="Search" 
              className="icon-img"
              onClick={handleSearchClick}
            />
          )}
        </div>
        
        <div className="cart-icon-wrapper">
          <Link to="/cart" className="position-relative d-inline-block">
            <img src="/images/shopping-cart.png" alt="Cart" className="icon-img" />
            {cartQuantity > 0 && (
              <span className="cart-badge">{cartQuantity}</span>
            )}
          </Link>
        </div>
        
        <div 
          className="user-icon-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link to={user ? "#" : "/auth"}>
            <img src="/images/user-icon.png" alt="User" className="icon-img"/>
          </Link>
          
          {showDropdown && (
            <div className="user-dropdown">
              {user ? (
                <>
                  <Link to="/profile">Thông tin cá nhân</Link>
                  <Link to="/orders">Đơn hàng</Link>

                  {user.role === "ROLE_ADMIN" && (
                    <Link to="/admin/dashboard">Dashboard</Link>
                  )}

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