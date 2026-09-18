import React, { useState } from 'react';
import { ordersAPI } from '../services/api';
import { ORDER_STATUS } from '../config/constants';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './TrackOrder.css';

function TrackOrder() {
  const [formData, setFormData] = useState({
    orderId: '',
    phone: ''
  });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: '#ffc107',
      [ORDER_STATUS.PROCESSING]: '#2196f3',
      [ORDER_STATUS.AWAITING_SHIPMENT]: '#9c27b0',
      [ORDER_STATUS.SHIPPING]: '#ff9800',
      [ORDER_STATUS.DELIVERED]: '#4caf50',
      [ORDER_STATUS.CANCELLED]: '#f44336'
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
      [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
      [ORDER_STATUS.AWAITING_SHIPMENT]: 'Chờ giao hàng',
      [ORDER_STATUS.SHIPPING]: 'Đang giao',
      [ORDER_STATUS.DELIVERED]: 'Đã giao',
      [ORDER_STATUS.CANCELLED]: 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.orderId.trim() || !formData.phone.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await ordersAPI.trackOrder({
        orderId: formData.orderId.trim(),
        phone: formData.phone.trim()
      });
      setOrder(response.data?.data?.order || response.data?.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-order-page">
      <div className="container">
        <div className="track-order-header">
          <h1>
            <i className="fas fa-search"></i> Tra cứu đơn hàng
          </h1>
          <p className="subtitle">Nhập mã đơn hàng và số điện thoại để tra cứu</p>
        </div>

        <div className="track-order-form-container">
          <form onSubmit={handleSubmit} className="track-order-form">
            <div className="form-group">
              <label htmlFor="orderId">
                <i className="fas fa-barcode"></i> Mã đơn hàng
              </label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="Ví dụ: 251224477160"
                required
              />
              <small className="form-hint">Mã đơn hàng được gửi qua email sau khi đặt hàng thành công</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <i className="fas fa-phone"></i> Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ví dụ: 0912345678"
                pattern="0[35789][0-9]{8}"
                required
              />
              <small className="form-hint">Số điện thoại người nhận hàng</small>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <button type="submit" className="btn-track" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang tra cứu...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i> Tra cứu đơn hàng
                </>
              )}
            </button>
          </form>
        </div>

        {order && (
          <div className="order-result">
            <div className="order-result-header">
              <h2>Thông tin đơn hàng</h2>
              <div className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                <i className="fas fa-info-circle"></i>
                {getStatusText(order.orderStatus)}
              </div>
            </div>

            <div className="order-info-grid">
              <div className="info-card">
                <h3><i className="fas fa-barcode"></i> Mã đơn hàng</h3>
                <p className="order-id">#{order.orderNumber || order._id}</p>
              </div>

              <div className="info-card">
                <h3><i className="fas fa-calendar"></i> Ngày đặt</h3>
                <p>{formatDate(order.orderDate)}</p>
              </div>

              <div className="info-card">
                <h3><i className="fas fa-credit-card"></i> Thanh toán</h3>
                <p>{order.paymentMethod}</p>
                {order.isPaid && <span className="badge-paid">Đã thanh toán</span>}
              </div>

              <div className="info-card">
                <h3><i className="fas fa-money-bill-wave"></i> Tổng tiền</h3>
                <p className="total-amount">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>

            <div className="shipping-info">
              <h3><i className="fas fa-shipping-fast"></i> Thông tin giao hàng</h3>
              <div className="shipping-details">
                <p><strong>Người nhận:</strong> {order.shippingName}</p>
                <p><strong>Số điện thoại:</strong> {order.shippingPhone}</p>
                <p><strong>Địa chỉ:</strong> {order.shippingAddress}, {order.shippingDistrict}, {order.shippingCity}</p>
                {order.notes && <p><strong>Ghi chú:</strong> {order.notes}</p>}
              </div>
            </div>

            <div className="order-items">
              <h3><i className="fas fa-box"></i> Sản phẩm đã đặt</h3>
              <div className="items-list">
                {order.orderDetails && order.orderDetails.length > 0 ? (
                  order.orderDetails.map((item, index) => {
                    const productName = item.book?.name || item.book?.bookTitle || item.book?.title || item.bookTitle || item.name || item.title || 'Sản phẩm';
                    const productAuthor = item.book?.author || item.author;
                    const productImage = getDefaultProductImage(item.book);

                    return (
                      <div key={index} className="order-item">
                        <img 
                          src={productImage} 
                          alt={productName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getCategoryFallbackImage(item.book);
                          }}
                        />
                        <div className="item-info">
                          <h4>{productName}</h4>
                          {productAuthor && <p className="item-author">Tác giả: {productAuthor}</p>}
                          <p className="item-quantity">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          <p>{formatPrice(item.unitPrice)}</p>
                          {item.discountPercent > 0 && (
                            <span className="discount">-{item.discountPercent}%</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-items">Không có sản phẩm</p>
                )}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(order.subTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {order.statusLog && order.statusLog.length > 0 && (
              <div className="status-timeline">
                <h3><i className="fas fa-history"></i> Lịch sử đơn hàng</h3>
                <div className="timeline">
                  {order.statusLog.map((log, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker" style={{ backgroundColor: getStatusColor(log.status) }}></div>
                      <div className="timeline-content">
                        <p className="timeline-status">{getStatusText(log.status)}</p>
                        <p className="timeline-date">{formatDate(log.timestamp)}</p>
                        {log.reason && <p className="timeline-reason">Lý do: {log.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
