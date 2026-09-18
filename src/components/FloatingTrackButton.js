import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './FloatingTrackButton.css';

function FloatingTrackButton() {
  const { isAuthenticated } = useAuth();

  // Chỉ hiển thị nút cho guest (người chưa đăng nhập)
  if (isAuthenticated) {
    return null;
  }

  return (
    <Link to="/track-order" className="floating-track-button" title="Tra cứu đơn hàng">
      <i className="fas fa-search"></i>
      <span className="button-text">Tra cứu đơn hàng</span>
    </Link>
  );
}

export default FloatingTrackButton;
