import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./style/ProductManagement.css";
import usePageTitle from '../hooks/usePageTitle';

export default function ProductManagement() {
  usePageTitle("Quản lý sản phẩm | CoreGPU");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null, name: "", brand: "", description: "", bus: "",
    product_condition:"", price: "", connector: "",
    warranty: "", imageUrl: [], memory: "", inventory: ""
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const formRef = useRef(null);

  const handleAddProduct = () => {
    resetForm();
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const fetchProducts = useCallback(() => {
    axios
      .get("http://localhost:8080/api/admin/products", { params: { search, page, size } })
      .then(res => {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => alert("Không thể tải danh sách sản phẩm!"));
  }, [search, page, size]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = () => {
    const productPayload = {
      ...form,
      images: form.images?.map((url, index) => ({
        imageUrl: url,
        isThumbnail: index === 0
      }))
    };

    const api = form.id
      ? axios.put(`http://localhost:8080/api/admin/products/${form.id}`, productPayload)
      : axios.post("http://localhost:8080/api/admin/products", productPayload);

    api
      .then(() => {
        fetchProducts();
        resetForm();
        setShowForm(false); 
      })
      .catch(() => alert("Lưu sản phẩm thất bại!"));
  };

  const handleEdit = (product) => {
    setForm(product);
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      axios
        .delete(`http://localhost:8080/api/admin/products/${id}`)
        .then(fetchProducts)
        .catch(() => alert("❌ Xóa sản phẩm thất bại!"));
    }
  };

  const resetForm = () => {
    setForm({
      id: null, brand: "", description: "", memory: "", product_condition: "",
      bus: "", name: "", warranty: "", connector: "", price: "", inventory: "",
      imageUrl: []
    });
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="product-management">
      <h2>Quản lý sản phẩm</h2>

      <div className="actions">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleAddProduct}>
          ➕ Thêm sản phẩm
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>Không có sản phẩm</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>
                  {p.price ? p.price.toLocaleString("vi-VN") + " ₫" : "0 ₫"}
                </td>
                <td>{p.inventory}</td>
                <td>
                  {p.images && p.images.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`${p.name}-${index}`} 
                      onClick={() => handleImageClick(url)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </td>
                <td>
                  <button className="edit" onClick={() => handleEdit(p)}>✏ Sửa</button>
                  <button className="delete" onClick={() => handleDelete(p.id)}>🗑 Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="image-modal-content">
            <img src={selectedImage} alt="" />
          </div>
        </div>
      )}

      <div className="pagination">
        {[...Array(totalPages).keys()].map((p) => (
          <button key={p} onClick={() => setPage(p)} className={p === page ? "active" : ""}>
            {p + 1}
          </button>
        ))}
      </div>

      {showForm && (
        <div ref={formRef} className="form">
          <h3>{form.id ? "✏ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm"}</h3>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Thương hiệu"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dung lượng bộ nhớ"
            value={form.memory}
            onChange={(e) => setForm({ ...form, memory: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tình trạng"
            value={form.product_condition}
            onChange={(e) => setForm({ ...form, product_condition: e.target.value })}
          />
          <input
            type="text"
            placeholder="Bus"
            value={form.bus}
            onChange={(e) => setForm({ ...form, bus: e.target.value })}
          />
          <input
            type="text"
            placeholder="Cổng kết nối"
            value={form.connector}
            onChange={(e) => setForm({ ...form, connector: e.target.value })}
          />
          <input
            type="text"
            placeholder="Bảo hành"
            value={form.warranty}
            onChange={(e) => setForm({ ...form, warranty: e.target.value })}
          />
          <input
            type="number"
            placeholder="Tồn kho"
            value={form.inventory}
            onChange={(e) => setForm({ ...form, inventory: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Ảnh"
            value={form.images ? form.images.join(",") : ""}
            onChange={(e) =>
              setForm({ ...form, images: e.target.value.split(",").map(img => img.trim()) })
            }
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
