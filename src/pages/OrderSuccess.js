import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OrderSuccess.css';

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const orderData = location.state || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép mã đơn hàng!');
  };

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <div className="success-circle">
              <i className="fas fa-check"></i>
            </div>
            <div className="success-animation"></div>
          </div>

          <h1>Đặt hàng thành công!</h1>
          <p className="success-subtitle">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
          </p>

          <div className="order-info-card">
            <div className="order-number">
              <i className="fas fa-receipt"></i>
              <div>
                <span className="label">Mã đơn hàng</span>
                <span className="value">#{orderData.orderNumber || 'N/A'}</span>
              </div>
              {orderData.orderNumber && (
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(orderData.orderNumber)}
                  title="Sao chép mã đơn hàng"
                >
                  <i className="fas fa-copy"></i>
                </button>
              )}
            </div>

            {!isAuthenticated && orderData.orderNumber && (
              <div className="guest-notice">
                <i className="fas fa-info-circle"></i>
                <div>
                  <strong>Lưu ý quan trọng:</strong>
                  <p>Vui lòng lưu lại mã đơn hàng <strong>#{orderData.orderNumber}</strong> và số điện thoại để tra cứu đơn hàng sau này.</p>
                  <button 
                    className="track-order-link"
                    onClick={() => navigate('/track-order', { 
                      state: { 
                        orderId: orderData.orderNumber, 
                        phone: orderData.phone 
                      }
                    })}
                  >
                    <i className="fas fa-search"></i> Tra cứu đơn hàng ngay
                  </button>
                </div>
              </div>
            )}

            <div className="order-details">
              <div className="detail-row">
                <span className="label">Phương thức thanh toán</span>
                <span className="value">
                  <i className="fas fa-money-bill-wave"></i>
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Tổng tiền</span>
                <span className="value price">{formatPrice(orderData.total || 257000)}</span>
              </div>

              <div className="detail-row">
                <span className="label">Địa chỉ giao hàng</span>
                <span className="value address">
                  {orderData.address || 'Địa chỉ đã nhập'}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Số điện thoại</span>
                <span className="value">{orderData.phone || 'Số điện thoại đã nhập'}</span>
              </div>
            </div>

            <div className="delivery-info">
              <div className="delivery-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="delivery-text">
                <strong>Thời gian giao hàng dự kiến</strong>
                <p>Đơn hàng sẽ được giao trong vòng 3-5 ngày làm việc</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {isAuthenticated ? (
              <button 
                className="btn-primary"
                onClick={() => navigate('/my-orders')}
              >
                <i className="fas fa-list-ul"></i>
                Xem đơn hàng của tôi
              </button>
            ) : (
              <button 
                className="btn-primary"
                onClick={() => navigate('/track-order')}
              >
                <i className="fas fa-search"></i>
                Tra cứu đơn hàng
              </button>
            )}
            <button 
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home"></i>
              Về trang chủ
            </button>
          </div>

          <div className="support-info">
            <i className="fas fa-headset"></i>
            <div>
              <strong>Cần hỗ trợ?</strong>
              <p>Liên hệ: <a href="tel:1900xxxx">1900 xxxx</a> hoặc <a href="mailto:support@zerabooks.com">support@zerabooks.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
