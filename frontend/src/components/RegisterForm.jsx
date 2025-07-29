import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/RegisterForm.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("Bạn phải đồng ý với điều khoản để tiếp tục.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        email: form.email,   
        password: form.password
      });
      alert('Đăng ký thành công!');
      navigate('/auth/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Đăng ký thất bại: ' + (err.response?.data || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Tạo tài khoản</h3>
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
