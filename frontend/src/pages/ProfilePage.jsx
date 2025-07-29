import React from 'react';
import '../style/ProfilePage.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const getLastName = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    return nameParts.length > 0 ? nameParts[nameParts.length - 1] : '';
  };

  return (
    <>
      <Navbar />
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
              <li>Đơn hàng của tôi</li>
              <li className="signout">Đăng xuất</li>
            </ul>
          </div>

          <div className="profile-main">
            <h2>Tài khoản</h2>

            <div className="section">
              <h3>Thông tin liên hệ</h3>
              <div className="detail-row">
                <div>
                  <div className="label">Họ và tên</div>
                  <div>{user.name}</div>
                </div>
                <div className="change">Thay đổi</div>
              </div>

              <div className="detail-row">
                <div>
                  <div className="label">Số điện thoại</div>
                  <div>{user.phone}</div>
                </div>
                <div className="change">Thay đổi</div>
              </div>

              <div className="detail-row">
                <div>
                  <div className="label">Email</div>
                  <div>{user.email}</div>
                </div>
                <div className="change">Thay đổi</div>
              </div>

              <div className="detail-row">
                <div>
                  <div className="label">Mật khẩu</div>
                  <div>********</div>
                </div>
                <div className="change">Thay đổi</div>
              </div>
            </div>

            <div className="section">
              <h3>Địa chỉ liên hệ</h3>
              <Link to="/add-address" className="add-address-btn">Thêm địa chỉ</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
