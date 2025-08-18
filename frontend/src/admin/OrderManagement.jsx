import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./style/OrderManagement.css";
import usePageTitle from '../hooks/usePageTitle';

export default function OrderManagement() {
  usePageTitle("Quản lý đơn hàng | CoreGPU");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [detailOrder, setDetailOrder] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null);

  const topRef = useRef(null);

  const fetchOrders = useCallback(() => {
    axios
      .get("http://localhost:8080/api/admin/orders", {
        params: { search, status, page, size },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? { content: res.data, totalPages: 1 } : res.data;
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => alert("❌ Không thể tải danh sách đơn hàng!"));
  }, [search, status, page, size]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleChangeStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8080/api/admin/orders/${id}`, { status: newStatus })
      .then(() => fetchOrders())
      .catch(() => alert("Cập nhật trạng thái thất bại!"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    axios
      .delete(`http://localhost:8080/api/admin/orders/${id}`)
      .then(fetchOrders)
      .catch(() => alert("Xóa đơn hàng thất bại!"));
  };

  const openDetail = (order) => {
    setDetailOrder(order);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeDetail = () => setDetailOrder(null);

  const openImage = (url) => setSelectedImage(url);
  const closeImage = () => setSelectedImage(null);

  return (
    <div className="orders-management" ref={topRef}>
      <h2>Quản lý đơn hàng</h2>

      <div className="actions">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm ..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(0); }}
          className="status-filter"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button onClick={() => { setSearch(""); setStatus(""); setPage(0); }}>
          Làm mới
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th style={{width: 70}}>ID</th>
            <th>Khách hàng</th>
            <th>Liên hệ</th>
            <th>Tổng tiền</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th style={{width: 220}}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>Không có đơn hàng</td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>
                  <div className="td-main">
                    <div className="td-title">{o.customerName || "—"}</div>
                    <div className="td-sub">{o.customerAddress || ""}</div>
                  </div>
                </td>
                <td>
                  <div className="td-main">
                    <div className="td-title">{o.phone || "—"}</div>
                    <div className="td-sub">{o.customerEmail || ""}</div>
                  </div>
                </td>
                <td>
                  {(o.totalAmount ?? 0).toLocaleString("vi-VN") + " ₫"}
                </td>
                <td>
                  {o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "—"}
                </td>
                <td>
                  <span className={`badge ${String(o.status || "").toLowerCase()}`}>
                    {o.status || "—"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <select
                      value={o.status || "PENDING"}
                      onChange={(e) => handleChangeStatus(o.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button className="view" onClick={() => openDetail(o)}>👁 Xem</button>
                    <button className="delete" onClick={() => handleDelete(o.id)}>🗑 Xóa</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((p) => (
          <button key={p} onClick={() => setPage(p)} className={p === page ? "active" : ""}>
            {p + 1}
          </button>
        ))}
      </div>

      {detailOrder && (
        <div className="detail-modal" onClick={closeDetail}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h3>Đơn #{detailOrder.id}</h3>
              <button className="close" onClick={closeDetail}>✖</button>
            </div>

            <div className="detail-grid">
              <div>
                <div className="label">Khách hàng</div>
                <div className="value">{detailOrder.customerName || "—"}</div>
              </div>
              <div>
                <div className="label">SĐT</div>
                <div className="value">{detailOrder.phone || "—"}</div>
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">{detailOrder.email || "—"}</div>
              </div>
              <div>
                <div className="label">Địa chỉ</div>
                <div className="value">{detailOrder.shippingAddress || "—"}</div>
              </div>
              <div>
                <div className="label">Tổng tiền</div>
                <div className="value">
                  {(detailOrder.totalAmount ?? 0).toLocaleString("vi-VN") + " ₫"}
                </div>
              </div>
              <div>
                <div className="label">Ngày tạo</div>
                <div className="value">
                  {detailOrder.createdAt ? new Date(detailOrder.createdAt).toLocaleString("vi-VN") : "—"}
                </div>
              </div>
              <div>
                <div className="label">Trạng thái</div>
                <div className="value">{detailOrder.status || "—"}</div>
              </div>
            </div>

            <h4>Sản phẩm trong đơn</h4>
            <div className="items">
              {(detailOrder.orderItems || []).length === 0 ? (
                <div className="empty">Không có sản phẩm</div>
              ) : (
                detailOrder.orderItems.map((it, idx) => (
                  <div className="item" key={idx}>
                    <div className="thumbs">
                      <img
                        src={
                          it.product.images?.find((img) => img.thumbnail)?.imageUrl
                            ? `http://localhost:8080${it.product.images.find((img) => img.thumbnail).imageUrl}`
                            : "/images/default.png"
                        }
                        alt={it.product.name}
                        onClick={() => openImage(it.product.thumbnail)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className="info">
                      <div className="name">{it.product?.name || "Sản phẩm"}</div>
                      <div className="meta">
                        SL: {it.quantity} × {(it.price ?? 0).toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                    <div className="line-total">
                      {(it.quantity * (it.price ?? 0)).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
          <div className="image-modal-content">
            <img src={selectedImage} alt="" />
          </div>
        </div>
      )}
    </div>
  );
}
