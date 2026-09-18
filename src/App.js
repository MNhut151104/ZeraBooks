import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import FloatingTrackButton from './components/FloatingTrackButton';

// Pages
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import PaymentQR from './pages/PaymentQR';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import OrderDetail from './pages/OrderDetail';
import UserOrderDetail from './pages/UserOrderDetail';
import TrackOrder from './pages/TrackOrder';
import Policy from './pages/Policy';

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const noLayoutPaths = ['/login', '/register', '/admin', '/admin/dashboard', '/order-success', '/payment-qr'];
  const showLayout = !noLayoutPaths.includes(location.pathname) && !location.pathname.startsWith('/admin');

  return (
    <div className="d-flex flex-column min-vh-100">
      {showLayout && <NavigationBar />}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:section" element={<Books />} />
          <Route path="/books/detail/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-qr" element={<PaymentQR />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/orders/:orderId" element={<UserOrderDetail />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/policy/:type" element={<Policy />} />
          <Route path="/terms" element={<Policy type="terms" />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
        </Routes>
      </main>
      {showLayout && <Footer />}
      {showLayout && <FloatingTrackButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
