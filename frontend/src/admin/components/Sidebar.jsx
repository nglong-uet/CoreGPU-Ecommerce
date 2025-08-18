import "../style/Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">CoreGPU</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
              Sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/customers" className={({ isActive }) => isActive ? "active" : ""}>
              Khách hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "active" : ""}>
              Đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? "active" : ""}>
              Đánh giá
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="account">
        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "active" : ""}>Cài đặt</NavLink>
        <NavLink to="/admin/support" className={({ isActive }) => isActive ? "active" : ""}>Hỗ trợ</NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>Quản lý người dùng</NavLink>
      </div>
      <button className="logout" onClick={handleLogout}>Đăng xuất</button>
    </aside>
  );
}
