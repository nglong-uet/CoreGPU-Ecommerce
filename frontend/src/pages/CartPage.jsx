import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/CartPage.css";
import usePageTitle from '../hooks/usePageTitle';

function CartPage() {
  usePageTitle("Giỏ hàng | CoreGPU");

  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [reloadTrigger, setReloadTrigger] = useState(Date.now());

  useEffect(() => {
    const latest = localStorage.getItem("cartUpdated");
    if (latest) {
      setReloadTrigger(Number(latest));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:8080/api/cart/user/${user.id}`)
        .then((res) => {
          setItems(res.data);

          const totalQuantity = res.data.reduce((sum, item) => sum + item.quantity, 0);
          localStorage.setItem("cartQuantity", totalQuantity);
        })
        .catch((err) => {
          console.error("Không lấy được giỏ hàng:", err);
        });
    }
  }, [reloadTrigger, user?.id]);

  const updateQuantity = async (index, delta) => {
    const newItems = [...items];
    const item = newItems[index];

    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: user.id,
        productId: item.product.id,
        quantity: delta,
      });
      localStorage.setItem("cartUpdated", Date.now()); 
      setReloadTrigger(Date.now());
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeItem = async (index) => {
    const item = items[index];
    try {
      await axios.delete(`http://localhost:8080/api/cart/remove`, {
        params: { userId: user.id, productId: item.product.id }
      });
      setReloadTrigger(Date.now());
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getGrandTotal = () => {
    return getSubtotal() + shippingFee;
  };

  useEffect(() => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    if (subtotal > 10000000) {
      setShippingFee(0);
    } else if (subtotal === 0) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
  }, [items]);

  return (
    <>
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
                        src={
                          item.product.images?.find(img => img.thumbnail)?.imageUrl
                            ? `http://localhost:8080${item.product.images.find(img => img.thumbnail).imageUrl}`
                            : "/images/default.png"
                        }
                        alt={item.product.name}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />

                      <div>
                        <strong>{item.product.name}</strong><br />
                        <p>{item.product.memory}</p>
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
              <button
                className="btn btn-success w-100 mt-3"
                onClick={() => navigate("/checkout")}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
