import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import "./style/CustomerManagement.css";

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", email: "", phone: ""});

  const formRef = useRef(null);

  const handleAddCustomer = () => {
    resetForm();
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const fetchCustomers = useCallback(() => {
    axios
      .get("http://localhost:8080/api/admin/customers", { params: { search, page, size } })
      .then(res => {
        setCustomers(res.data || []);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => alert("❌ Không thể tải danh sách khách hàng!"));
  }, [search, page, size]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleEdit = (customer) => {
    setForm(customer);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      axios
        .delete(`http://localhost:8080/api/admin/customers/${id}`)
        .then(fetchCustomers)
        .catch(() => alert("❌ Xóa khách hàng thất bại!"));
    }
  };

  const handleSave = () => {
    const api = form.id
      ? axios.put(`http://localhost:8080/api/admin/customers/${form.id}`, form)
      : axios.post("http://localhost:8080/api/admin/customers", form);

    api
      .then(() => {
        fetchCustomers();
        resetForm();
      })
      .catch(() => alert("❌ Lưu thông tin thất bại!"));
  };

  const resetForm = () => {
    setForm({ id: null, name: "", phone: "", email: ""});
  };

  return (
    <div className="customer-management">
      <h2>Quản lý khách hàng</h2>

      <div className="actions">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleAddCustomer}>
          ➕ Thêm khách hàng
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã KH</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số ĐT</th>
            <th>Số đơn hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.userId}>
              <td>{customer.userId}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.orderCount}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(customer)}>✏ Sửa</button>
                <button className="delete" onClick={() => handleDelete(customer.id)}>🗑 Xóa</button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Không tìm thấy khách hàng
              </td>
            </tr>
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

      {showForm && (
        <div ref={formRef} className="form">
          <h3>{form.id ? "✏ Chỉnh sửa thông tin" : "➕ Thêm khách hàng"}</h3>
          <input
            type="text"
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div>
            <button onClick={handleSave}>💾 Lưu</button>
            <button onClick={() => setShowForm(false)}>❌ Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
