import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../style/AuthPage.css';

export default function AuthPage() {
  return (
    <>
    <Navbar />
    <div className="auth-wrapper">
      <div className="auth-box">
        <Routes>
          <Route path="/login" element={
          <>
            <LoginForm />
            <p>Chưa có tài khoản? <Link to="/auth/register">Đăng ký</Link></p>
          </>
          } />
          <Route path="/register" element={
            <>
              <RegisterForm />
              <p>Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link></p>
            </>
          } />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>

        <div className="or-divider">
          <span>Hoặc đăng nhập với</span>
        </div>
        <div className="social-login">
          <button type="button" className="google-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
            Google
          </button>
          <button type="button" className="facebook-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="Facebook" />
            Facebook
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
