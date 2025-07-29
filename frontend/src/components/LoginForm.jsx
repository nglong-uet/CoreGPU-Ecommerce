import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/api/auth/login', { email, password })
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate('/');
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setErrorMessage("Email hoặc mật khẩu không đúng");
        } else {
          setErrorMessage("Lỗi kết nối đến server");
        }
      });
    }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Đăng nhập</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
