import React from 'react';
import '../style/AddAddressPage.css';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function AddAddressPage() {
  usePageTitle("Thêm địa chỉ | CoreGPU");
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div className="container">
        <div className="breadcrumb mb-3 mt-3">
          <Link to="/" className="breadcrumb-link">
            <img src="/icons/home.svg" alt="Home" className="icon-home" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/profile" className="breadcrumb-link">Tài khoản</Link>
          <span className="mx-2">/</span>
          <span>Thêm địa chỉ</span>
        </div>

        <div className="profile-wrapper">
          <div className="profile-sidebar">
            <h2>Hello {user.name}</h2>
            <p>Chào mừng đến tài khoản của bạn.</p>
            <ul className="sidebar-menu">
              <li className="active">Thông tin cá nhân</li>
              <li>Đơn hàng của tôi</li>
              <li className="signout">Đăng xuất</li>
            </ul>
          </div>

          <div className="profile-main">
            <h2>Tài khoản</h2>
            <h3>Thêm địa chỉ</h3>

            <form className="section">
              <div className="form-row">
                <div className="form-group full">
                  <label>Họ và tên</label>
                  <input type="text" placeholder="Họ và tên" />
                </div>
                <div className="form-group short">
                  <label>Giới tính</label>
                  <select>
                    <option>Nam</option>
                    <option>Nữ</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quốc gia</label>
                  <input type="text" placeholder="Quốc gia" />
                </div>
                <div className="form-group">
                  <label>Tỉnh/Thành phố</label>
                  <input type="text" placeholder="Tỉnh/Thành phố" />
                </div>
                <div className="form-group">
                  <label>Quận/Huyện</label>
                  <input type="text" placeholder="Quận/Huyện" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" placeholder="Số nhà ,đường" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Điện thoại</label>
                  <input type="text" placeholder="Điện thoại" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Mô tả</label>
                  <textarea placeholder="Thông tin khi giao hàng, nhắc nhở người giao." />
                </div>
              </div>

              <button type="submit" className="submit-btn">Lưu địa chỉ</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
