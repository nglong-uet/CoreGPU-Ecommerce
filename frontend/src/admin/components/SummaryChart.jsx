import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../style/SummaryChart.css";

export default function SummaryChart() {
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats/summary")
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu biểu đồ", err));

    fetch("http://localhost:8080/api/admin/stats/top-products")
      .then((res) => res.json())
      .then((data) => setTopProducts(data))
      .catch((err) =>
        console.error("Xảy ra lỗi khi lấy danh sách sản phẩm", err)
      );
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = topProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(topProducts.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="dashboard-container">
      <div className="summary-card">
        <div className="summary-header">
          <h5>Tóm tắt</h5>
          <div className="summary-legend">
            <div className="legend-item">
              <span className="dot order"></span> Đơn hàng
            </div>
            <div className="legend-item">
              <span className="dot income"></span> Tăng trưởng
            </div>
            <select className="time-filter">
              <option>7 Ngày</option>
              <option>30 Ngày</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, "dataMax + 2000"]}
              tickFormatter={(v) =>
                v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              }
            />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              }
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#84cc16"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="products-card">
        <div className="products-header">
          <h5>Sản phẩm bán chạy</h5>
          <button className="dots">⋮</button>
        </div>
        <div className="products-list">
          {currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <div key={index} className="products-item">
                <div className="products-info">
                  <img
                    src={`http://localhost:8080${product.thumbnail}`}
                    alt={product.name}
                  />
                  <div>
                    <div className="products-name">{product.name}</div>
                    <div className="products-id">ID: {product.id}</div>
                  </div>
                </div>
                <span className="sales-tag">{product.quantity} Đã bán</span>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm bán chạy</p>
          )}
        </div>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
