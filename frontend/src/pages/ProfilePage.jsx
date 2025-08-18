import React, { useState } from 'react';
import '../style/ProfilePage.css';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import axios from 'axios';

export default function ProfilePage() {
  usePageTitle("Thông tin cá nhân | CoreGPU");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  
  const [user, setUser] = useState(storedUser);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const getLastName = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
  };

  const handleEdit = (field) => {
    setEditField(field);
    setTempValue(user[field]);
  };

  const handleSave = async (field) => {
    try {
      const updatedUser = { ...user, [field]: tempValue };
      await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditField(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
    }
  };

  return (
    <div className="container">
      <div className="breadcrumb mb-3 mt-3">
        <Link to="/" className="breadcrumb-link">
          <img src="/icons/home.svg" alt="Home" className="icon-home" />
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span>Tài khoản</span>
      </div>

      <div className="profile-wrapper">
        <div className="profile-sidebar">
          <h2>Xin chào, {getLastName(user?.name)}!</h2>
          <p>Chào mừng đến tài khoản của bạn.</p>
          <ul className="sidebar-menu">
            <li className="active">Thông tin cá nhân</li>
            <li><Link to="/orders" className="nav-link">Đơn hàng của tôi</Link></li>
            <li className="signout">Đăng xuất</li>
          </ul>
        </div>

        <div className="profile-main">
          <h2>Tài khoản</h2>

          <div className="section">
            <h3>Thông tin liên hệ</h3>

            {/* Họ và tên */}
            <div className="detail-row">
              <div>
                <div className="label">Họ và tên</div>
                {editField === "name" ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  <div>{user.name}</div>
                )}
              </div>
              <div className="change">
                {editField === "name" ? (
                  <button onClick={() => handleSave("name")}>Lưu</button>
                ) : (
                  <button onClick={() => handleEdit("name")}>Thay đổi</button>
                )}
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="detail-row">
              <div>
                <div className="label">Số điện thoại</div>
                {editField === "phone" ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  <div>{user.phone}</div>
                )}
              </div>
              <div className="change">
                {editField === "phone" ? (
                  <button onClick={() => handleSave("phone")}>Lưu</button>
                ) : (
                  <button onClick={() => handleEdit("phone")}>Thay đổi</button>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="detail-row">
              <div>
                <div className="label">Email</div>
                {editField === "email" ? (
                  <input
                    type="email"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  <div>{user.email}</div>
                )}
              </div>
              <div className="change">
                {editField === "email" ? (
                  <button onClick={() => handleSave("email")}>Lưu</button>
                ) : (
                  <button onClick={() => handleEdit("email")}>Thay đổi</button>
                )}
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="detail-row">
              <div>
                <div className="label">Mật khẩu</div>
                {editField === "password" ? (
                  <input
                    type="password"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  <div>********</div>
                )}
              </div>
              <div className="change">
                {editField === "password" ? (
                  <button onClick={() => handleSave("password")}>Lưu</button>
                ) : (
                  <button onClick={() => handleEdit("password")}>Thay đổi</button>
                )}
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Địa chỉ liên hệ</h3>
            <Link to="/add-address" className="add-address-btn">Thêm địa chỉ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
