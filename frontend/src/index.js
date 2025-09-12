import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const loginUser = (data) => axios.post('/api/auth/login', data);
export const getCart = (userId) => axios.get(`/api/cart/user/${userId}`);
export const addToCart = (payload) => axios.post('/api/cart/add', payload);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="433212735998-j2o6svf718srf71j13l53ritliasm4ps.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
