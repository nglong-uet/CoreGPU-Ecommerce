import React, { useEffect, useState } from "react";
import "../style/ProfilePage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import usePageTitle from "../hooks/usePageTitle";

export default function OrderPage() {
  usePageTitle("Đơn hàng của tôi | CoreGPU");
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:8080/api/orders/user/${user.id}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Không lấy được đơn hàng:", err));
    }
  }, [user?.id]);

  const getLastName = (fullName) => {
    if (!fullName) return "";
    const nameParts = fullName.trim().split(" ");
    return nameParts.length > 0 ? nameParts[nameParts.length - 1] : "";
  };

  return (
    <div className="container">
      <div className="breadcrumb mb-3 mt-3">
        <Link to="/" className="breadcrumb-link">
          <img src="/icons/home.svg" alt="Home" className="icon-home" />
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span>Đơn hàng</span>
      </div>

      <div className="profile-wrapper">
        <div className="profile-sidebar">
          <h2>Xin chào, {getLastName(user?.name)}!</h2>
          <p>Chào mừng đến tài khoản của bạn.</p>
          <ul className="sidebar-menu">
            <li>
              <Link to="/profile" className="nav-link">Thông tin cá nhân</Link>
            </li>
            <li className="active">Đơn hàng của tôi</li>
            <li className="signout">Đăng xuất</li>
          </ul>
        </div>

        <div className="profile-main">
          <h2>Đơn hàng của tôi</h2>

          {orders.length === 0 ? (
            <p>Bạn chưa có đơn hàng nào.</p>
          ) : (
            orders.map((order, idx) => (
              <div className="card p-4 mb-4 shadow-sm rounded-4 border-0" key={idx}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>Mã đơn hàng:</strong> #{order.id}
                  </div>
                  <div
                    className={`order-status ${
                      order.status === "Đã giao"
                        ? "status-delivered"
                        : order.status === "Đang xử lý"
                        ? "status-processing"
                        : order.status === "Đã hủy"
                        ? "status-cancelled"
                        : "status-default"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
                <div className="mb-2">
                  <strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="mb-2">
                  <strong>Giao đến:</strong> {order.shippingAddress}
                </div>

                <div className="mt-3">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="d-flex mb-3 align-items-center border-bottom pb-2">
                      <img
                        src={
                          item.product.images?.find((img) => img.thumbnail)?.imageUrl
                            ? `http://localhost:8080${item.product.images.find((img) => img.thumbnail).imageUrl}`
                            : "/images/default.png"
                        }
                        alt={item.product.name}
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                      <div className="ms-3 flex-grow-1">
                        <div>{item.product.name}</div>
                        <div className="text-muted small">
                          {item.quantity} x {item.price.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                      <div className="fw-bold">
                        {(item.quantity * item.price).toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-end fw-bold fs-5">
                  Tổng cộng: {order.totalAmount.toLocaleString("vi-VN")}₫
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
