import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import AuthPage from './pages/AuthPage';
import ProductDetail from './pages/ProductDetail';
import ProfilePage from './pages/ProfilePage';
import AddAddressPage from './pages/AddAddressPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-address" element={<AddAddressPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
