import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar-custom">
      <div className="navbar-left">
        <img src="./images/logo.png" alt="Logo" className="logo" />
      </div>

      <ul className="navbar-center">
        <li>TRANG CHỦ</li>
        <li>SẢN PHẨM</li>
        <li>CỘNG ĐỒNG</li>
        <li>NỔI BẬT</li>
        <li>ĐÁNH GIÁ</li>
        <li>HỖ TRỢ</li>
      </ul>

      <div className="navbar-right">
        <img src="./images/search-icon.png" alt="Search" className="icon-img"/>
        <img src="./images/shopping-cart.png" alt="Cart" className="icon-img"/>
        <img src="./images/user.png" alt="User" className="icon-img"/>
      </div>
    </nav>
  );
}
