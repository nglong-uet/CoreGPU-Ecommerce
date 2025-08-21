import { useState, useEffect } from "react";
import axios from "axios";
import usePageTitle from "../hooks/usePageTitle";
import "./style/Setting.css";

export default function Setting() {
  usePageTitle("Cài đặt | CoreGPU");

  const [settings, setSettings] = useState({
    siteName: "CoreGPU",
    adminEmail: "",
    notification: true,
    theme: "light",
    twoFA: false,
    autoBackup: true,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/settings")
      .then((res) => setSettings(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    axios
      .post("http://localhost:8080/api/admin/settings", settings)
      .then(() => alert("Cập nhật cài đặt thành công!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="admin-settings">
      <h2>⚙️ Cài đặt hệ thống</h2>
      <p className="desc">Quản lý cấu hình và tùy chỉnh hệ thống của bạn.</p>

      <div className="settings-card">
        <h3>🌐 Thông tin website</h3>
        <label>
          Tên website
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email quản trị
          <input
            type="email"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="settings-card">
        <h3>🔔 Thông báo</h3>
        <div className="setting-item">
          <span>Bật thông báo hệ thống</span>
          <label className="switch">
            <input
              type="checkbox"
              name="notification"
              checked={settings.notification}
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="settings-card">
        <h3>🎨 Giao diện</h3>
        <label>
          Chế độ hiển thị
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">🌞 Sáng</option>
            <option value="dark">🌙 Tối</option>
          </select>
        </label>
      </div>

      <div className="settings-card">
        <h3>🔒 Bảo mật</h3>
        <div className="setting-item">
          <span>Xác thực 2 lớp (2FA)</span>
          <label className="switch">
            <input
              type="checkbox"
              name="twoFA"
              checked={settings.twoFA}
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting-item">
          <span>Tự động sao lưu dữ liệu</span>
          <label className="switch">
            <input
              type="checkbox"
              name="autoBackup"
              checked={settings.autoBackup}
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <button className="save-btn" onClick={handleSave}>
        💾 Lưu thay đổi
      </button>
    </div>
  );
}
