import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../style/CartPage.css";

function CartPage() {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:8080/api/cart/user/${user.id}`)
        .then((res) => {
          setItems(res.data);
        })
        .catch((err) => {
          console.error("Không lấy được giỏ hàng:", err);
        });
    }
  }, [user]);

  const updateQuantity = (index, delta) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta);
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getGrandTotal = () => {
    return getSubtotal() + shippingFee;
  };

  useEffect(() => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    if (subtotal > 5000000) {
      setShippingFee(0);
    } else if (subtotal === 0) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
  }, [items]);


  return (
    <>
      <Navbar />
      <div className="container py-3">
        <div className="breadcrumb mb-3">
          <Link to="/" className="breadcrumb-link">
            <img src="/icons/home.svg" alt="Home" className="icon-home" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span>Giỏ hàng</span>
        </div>

        <div className="row">
          <div className="col-md-8">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Thông tin sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                  <th>Xoá</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-start d-flex align-items-center gap-3">
                      <img
                        src={item.product.thumbnail || "/images/default.png"}
                        alt={item.product.name}
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                      <div>
                        <strong>{item.product.name}</strong><br />
                      </div>
                    </td>
                    <td>{item.product.price.toLocaleString("vi-VN")}₫</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(idx, -1)}>-</button>
                        <span className="mx-2">{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(idx, 1)}>+</button>
                      </div>
                    </td>
                    <td>{item.product.shipping || "FREE"}</td>
                    <td>{(item.product.price * item.quantity).toLocaleString("vi-VN")}₫</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(idx)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-md-4">
            <div className="border p-3 mb-3 bg-light">
              <h5>Mã giảm giá</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Điền mã giảm giá"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="btn btn-dark w-100 mb-2">Áp dụng mã</button>
              <Link to="/products" className="btn btn-outline-secondary w-100">Tiếp tục mua hàng</Link>
            </div>
            <div className="border p-3 bg-light">
              <div className="d-flex justify-content-between">
                <span>Giá sản phẩm</span>
                <span>{getSubtotal().toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Phí ship</span>
                <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Thành tiền</span>
                <span>{getGrandTotal().toLocaleString("vi-VN")}₫</span>
              </div>
              <button className="btn btn-success w-100 mt-3">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CartPage;
