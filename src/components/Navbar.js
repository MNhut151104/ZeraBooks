import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function NavigationBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="zera-header">
        <div className="main-header">
          <div className="container">
            <div className="logo-container">
              <Link to="/" className="home-icon-link" title="Trang chủ">
                <i className="fa-solid fa-house"></i>
              </Link>
              <div className="site-name">
                <Link to="/" style={{ background: 'none', webkitBackgroundClip: 'initial', webkitTextFillColor: 'initial', backgroundClip: 'initial' }}>Zera Books</Link>
              </div>
            </div>

            <div className="search-container">
              <Form>
                <Form.Control 
                  type="text" 
                  className="search-bar" 
                  placeholder="Tìm kiếm sản phẩm mong muốn..." 
                />
                <button type="submit" className="search-btn">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </Form>
            </div>

            <div className="user-icons">
              <Link to="/cart" className="icon-item cart-icon-container" title="Giỏ hàng">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>

              {isAuthenticated ? (
                <Dropdown className="user-menu-dropdown">
                  <Dropdown.Toggle variant="link" className="user-avatar-btn">
                    <div className="user-avatar">
                      <i className="fa-solid fa-user"></i>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" className="user-dropdown-menu">
                    <div className="user-info-header">
                      <div className="user-avatar-large">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div className="user-details">
                        <strong>{user?.fullName}</strong>
                        <small>{user?.email}</small>
                      </div>
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fa-solid fa-user"></i> Tài khoản của tôi
                    </Dropdown.Item>
                    {user?.type === 'admin' && (
                      <Dropdown.Item as={Link} to="/admin/dashboard">
                        <i className="fa-solid fa-gauge"></i> Dashboard
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item as={Link} to="/my-orders">
                      <i className="fa-solid fa-box"></i> Đơn hàng của tôi
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="fa-solid fa-sign-out-alt"></i> Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login" className="btn btn-register">
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default NavigationBar;
