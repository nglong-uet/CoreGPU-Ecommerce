import React, { useState } from 'react';
import './RegisterForm.css';

export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: '', userName: '', email: '', password: '', agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("Bạn phải đồng ý với điều khoản để tiếp tục.");
      return;
    }
    console.log('Registering:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Tạo tài khoản</h3>
      <input
        type="text"
        name="fullName"
        placeholder="Họ và tên"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="userName"
        placeholder="Tên đăng nhập"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        onChange={handleChange}
        required
      />

      <label className="agree-label">
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={handleChange}
          required
        />
        Tôi đồng ý với{' '} 
        <a href="/term" target="_blank" rel="noopener noreferrer">điều khoản và điều kiện</a>
      </label>

      <button type="submit">Đăng ký</button>
    </form>
  );
}
