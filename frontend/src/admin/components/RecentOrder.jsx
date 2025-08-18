import React from "react";
import "../style/RecentOrder.css";
import { useState, useEffect } from "react";

function RecentOrder() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats/recent")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Lỗi lấy đơn hàng gần đây:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats/top")
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error("Lỗi lấy khách hàng nổi bật:", err));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  // Tổng số trang
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="dashboard-container">
      <div className="order-card">
        <div className="order-header">
          <h5>Đơn hàng gần đây</h5>
          <button className="dots">⋮</button>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Khách hàng</th>
              <th>Thời gian</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{order.customerName}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(order.totalAmount)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "COMPLETED" ? "bg-success" :
                        order.status === "PENDING" ? "bg-warning" : "bg-secondary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">Không có đơn hàng gần đây</td></tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      </div>

      <div className="customer-card">
        <div className="customer-header">
          <h5>Khách hàng nổi bật</h5>
        </div>
        <div className="customer-list">
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <div key={index} className="customer-item">
                <div className="customer-info">
                  <img
                    src={`/images/user.png`}
                    alt={customer.customerName}
                  />
                  <div>
                    <div className="customer-name">{customer.customerName}</div>
                    <div className="customer-orders">{customer.orderCount} Đơn hàng</div>
                  </div>
                </div>
                <button className="view-btn">Xem</button>
              </div>
            ))
          ) : (
            <div>Không có khách hàng trong tuần</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentOrder;
