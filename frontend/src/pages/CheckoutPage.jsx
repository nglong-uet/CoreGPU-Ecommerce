import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../style/CheckoutPage.css";
import usePageTitle from "../hooks/usePageTitle";

function CheckoutPage() {
  usePageTitle("Thông tin mua hàng | CoreGPU")

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi khi lấy tỉnh:", err));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => setDistricts(res.data.districts))
        .catch((err) => console.error("Lỗi khi lấy quận/huyện:", err));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/cart/user/${user.id}`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error("Không lấy được giỏ hàng:", err);
      });
  }, [user.id]);

  useEffect(() => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    setShippingFee(subtotal > 10000000 || subtotal === 0 ? 0 : 30000);
  }, [items]);

  const handleCheckout = async () => {
    if (!name || !phone || !address || !selectedProvince || !selectedDistrict) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    const fullAddress = `${address}, ${provinces.find(p => p.code === parseInt(selectedProvince, selectedDistrict))?.name || ""}`;

    if (paymentMethod === "vnpay") {
      try {
        const res = await axios.get("http://localhost:8080/api/payment/create", {
          params: {
            userId: user.id,
            amount: getGrandTotal(), 
            name,
            phone,
            address: fullAddress
          }
        });
        window.location.href = res.data.paymentUrl;
      } catch (err) {
        alert("Không thể tạo thanh toán VNPAY");
      }
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/orders/checkout`, null, {
        params: { 
          userId: user.id, 
          name, 
          phone, 
          address: fullAddress 
        }
      });
      alert("Thanh toán thành công!");
      navigate("/thankyou");
    } catch (err) {
      alert("Có lỗi xảy ra khi thanh toán.");
    }
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getGrandTotal = () => getSubtotal() + shippingFee;

  return (
    <>
      <div className="container py-3">
        <div className="breadcrumb mb-3">
          <Link to="/" className="breadcrumb-link">
            <img src="/icons/home.svg" alt="Home" className="icon-home" />
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span>Thanh toán</span>
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm rounded-4 border-0">
              <h4 className="mb-4 fw-bold">Thông tin mua hàng</h4>

              <div className="mb-3">
                <label className="form-label">Họ và tên *</label>
                <input type="text" className="form-control" placeholder="Nhập họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Số điện thoại *</label>
                <input type="text" className="form-control" placeholder="Nhập số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tỉnh/Thành phố *</label>
                  <select className="form-select" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {provinces.map((prov) => (
                      <option key={prov.code} value={prov.code}>{prov.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Quận/Huyện *</label>
                  <select className="form-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                    <option value="">-- Chọn quận/huyện --</option>
                    {districts.map((dist) => (
                      <option key={dist.code} value={dist.name}>{dist.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Địa chỉ cụ thể *</label>
                <textarea className="form-control" placeholder="Ví dụ: Số nhà 12, đường Trần Phú..." value={address} onChange={(e) => setAddress(e.target.value)} rows="3" />
              </div>

              <div className="mb-3">
                <label className="form-label d-block">Phương thức thanh toán *</label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="vnpay"
                    value="vnpay"
                    onChange={() => setPaymentMethod("vnpay")}
                  />
                  <label className="form-check-label" htmlFor="bank">Thanh toán VNPay</label>
                </div>
              </div>

              <div className="form-check mt-3">
                <input className="form-check-input" type="checkbox" id="agreeCheck" />
                <label className="form-check-label" htmlFor="agreeCheck">
                  Tôi đồng ý với <a href="/term" target="_blank" rel="noopener noreferrer">điều khoản và điều kiện</a>
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow-sm rounded-4 border-0">
              <h5 className="mb-4 fw-bold">Đơn hàng của bạn</h5>

              {items.map((item, idx) => (
                <div key={idx} className="d-flex mb-3 align-items-center checkout-item-modern">
                  <img
                    src={
                      item.product.images?.find(img => img.thumbnail)?.imageUrl
                      ? `http://localhost:8080${item.product.images.find(img => img.thumbnail).imageUrl}`
                      : "/images/default.png"
                    }
                    alt={item.product.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{item.product.name}</div>
                    <div className="text-muted small">{item.quantity} x {item.product.price.toLocaleString("vi-VN")}₫</div>
                  </div>
                  <div className="fw-bold">{(item.product.price * item.quantity).toLocaleString("vi-VN")}₫</div>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between">
                <span>Tạm tính</span>
                <span>{getSubtotal().toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Phí ship</span>
                <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Thành tiền</span>
                <span>{getGrandTotal().toLocaleString("vi-VN")}₫</span>
              </div>

              <button className="btn btn-primary w-100 mt-4 py-2" onClick={handleCheckout}>
                Xác nhận mua hàng
              </button>

              <Link to="/cart" className="btn btn-outline-secondary w-100 mt-2">Quay lại giỏ hàng</Link>

              <div className="text-center mt-3 text-muted small">
                <i className="bi bi-shield-lock-fill me-2"></i>
                Bảo mật SSL - An toàn tuyệt đối
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
