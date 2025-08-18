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
import Search from './pages/Search';
import CheckoutPage from './pages/CheckoutPage';
import MainLayout from './layout/MainLayout';
import OrderPage from './pages/OrderPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from "./admin/AdminLayout";
import ThankYouPage from "./pages/ThankYouPage";
import ProductManagement from './admin/ProductManagement';
import CustomerManagement from './admin/CustomerManagement';
import OrderManagement from './admin/OrderManagement';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-address" element={<AddAddressPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/thankyou" element={<ThankYouPage />}/>
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/customers" element={<CustomerManagement/>}/>
            <Route path="/admin/orders" element={<OrderManagement />}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
