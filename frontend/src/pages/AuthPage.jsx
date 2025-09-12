import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../style/AuthPage.css';
import usePageTitle from '../hooks/usePageTitle';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function AuthPage() {
  usePageTitle("Đăng nhập/Đăng ký");

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const googleUser = res.data;
        console.log("Google User info: ", googleUser);

        const backendRes = await axios.post("http://localhost:8080/api/auth/google", {
          token: access_token,
        });

        localStorage.setItem("user", JSON.stringify(backendRes.data));
        window.location.href = "/";
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: () => {
      console.log("Google Login Error");
    },
  });

  const handleFacebookLogin = () => {
    try {
      window.FB.login((response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          handleFacebookResponse(accessToken); 
        } else {
          console.log("Facebook login failed");
        }
      }, { scope: 'email,public_profile' });
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  const handleFacebookResponse = async (accessToken) => {
    try {
      const backendRes = await axios.post("http://localhost:8080/api/auth/facebook", {
        token: accessToken,
      });

      localStorage.setItem("user", JSON.stringify(backendRes.data));
      window.location.href = "/";
    } catch (err) {
      console.error("Facebook response error:", err);
    }
  };

  return (
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
          <button
            type="button"
            className="google-btn"
            onClick={() => handleGoogleLogin()}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
            Google
          </button>

          <button
            type="button"
            className="facebook-btn"
            onClick={handleFacebookLogin}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="Facebook" />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
