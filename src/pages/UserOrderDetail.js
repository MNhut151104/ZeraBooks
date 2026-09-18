import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ordersAPI, reviewsAPI } from '../services/api';
import ReturnRequestModal from '../components/ReturnRequestModal';
import ReviewModal from '../components/ReviewModal';
import { ORDER_STATUS } from '../config/constants';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './UserOrderDetail.css';

function UserOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    book: null
  });

  const statusFlow = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.AWAITING_SHIPMENT,
    ORDER_STATUS.SHIPPING,
    ORDER_STATUS.DELIVERED
  ];

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch order and reviews in parallel
      const [orderResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        reviewsAPI.getMyReviews().catch(() => ({ data: { reviews: [] } }))
      ]);
      
      setOrder(orderResponse.data.data?.order || orderResponse.data.order);
      setMyReviews(reviewsResponse.data.reviews || []);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Không thể tải thông tin đơn hàng');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
      [ORDER_STATUS.PROCESSING]: 'Chờ lấy hàng',
      [ORDER_STATUS.AWAITING_SHIPMENT]: 'Chờ giao hàng',
      [ORDER_STATUS.SHIPPING]: 'Đang giao hàng',
      [ORDER_STATUS.DELIVERED]: 'Đã giao',
      [ORDER_STATUS.CANCELLED]: 'Đã hủy',
      'ReturnRequested': 'Yêu cầu hoàn hàng',
      [ORDER_STATUS.RETURNED]: 'Đã hoàn hàng'
    };
    return labels[status] || status;
  };

  const canRequestReturn = () => {
    if (order?.orderStatus !== ORDER_STATUS.DELIVERED) return false;
    if (order?.returnRequest?.isRequested) return false;
    
    // Check if within 7 days of delivery
    if (order?.deliveryDate) {
      const daysSinceDelivery = Math.floor((Date.now() - new Date(order.deliveryDate)) / (1000 * 60 * 60 * 24));
      return daysSinceDelivery <= 7;
    }
    
    return true;
  };

  const handleReturnRequest = async (data) => {
    try {
      await ordersAPI.requestReturn(orderId, data);
      alert('Yêu cầu hoàn hàng đã được gửi thành công!');
      fetchOrderDetail(); // Refresh order data
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể gửi yêu cầu hoàn hàng');
    }
  };

  const handleOpenReview = (book) => {
    setReviewModal({
      isOpen: true,
      book
    });
  };

  const handleCloseReview = () => {
    setReviewModal({
      isOpen: false,
      book: null
    });
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await reviewsAPI.createReview(reviewData);
      handleCloseReview();
      fetchOrderDetail(); // Refresh to update reviews
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
      throw err;
    }
  };

  const getBookReview = (bookId) => {
    return myReviews.find(review => 
      (review.book?._id || review.book) === bookId
    );
  };

  const getCurrentStatusIndex = () => {
    if (order?.orderStatus === 'Cancelled') return -1;
    return statusFlow.indexOf(order?.orderStatus);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      await ordersAPI.cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công!');
      fetchOrderDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return '#f39c12';
      case ORDER_STATUS.PROCESSING: return '#3498db';
      case ORDER_STATUS.AWAITING_SHIPMENT:
      case ORDER_STATUS.SHIPPING: return '#2980b9';
      case ORDER_STATUS.DELIVERED: return '#27ae60';
      case ORDER_STATUS.CANCELLED: return '#e74c3c';
      default: return '#f39c12';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return '#fff8e7';
      case ORDER_STATUS.PROCESSING: return '#e3f2fd';
      case ORDER_STATUS.AWAITING_SHIPMENT:
      case ORDER_STATUS.SHIPPING: return '#e1f5fe';
      case ORDER_STATUS.DELIVERED: return '#e8f5e9';
      case ORDER_STATUS.CANCELLED: return '#ffebee';
      default: return '#fff8e7';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return 'fas fa-clock';
      case ORDER_STATUS.PROCESSING: return 'fas fa-box';
      case ORDER_STATUS.AWAITING_SHIPMENT:
      case ORDER_STATUS.SHIPPING: return 'fas fa-truck';
      case ORDER_STATUS.DELIVERED: return 'fas fa-check-circle';
      case ORDER_STATUS.CANCELLED: return 'fas fa-times-circle';
      default: return 'fas fa-clock';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-order-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="user-order-detail-page">
        <div className="error-container">
          <h2>Không tìm thấy đơn hàng</h2>
          <button onClick={() => navigate('/my-orders')}>Quay lại</button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="user-order-detail-page">
      <div className="user-order-detail-container">
        {/* Header */}
        <div className="user-order-detail-header">
          <div className="header-col-back">
            <button className="back-btn" onClick={() => navigate('/my-orders')}>
              <i className="fas fa-chevron-left"></i>
              <span>TRỞ VỀ DANH SÁCH ĐƠN HÀNG</span>
            </button>
          </div>
          <div className="header-col-code">
            <span className="code-label">MÃ ĐƠN HÀNG:</span>
            <span className="code-value">#{order.orderNumber || order._id}</span>
          </div>
          <div className="header-col-status">
            <div className="header-status-pill" style={{ color: getStatusColor(order.orderStatus), backgroundColor: getStatusBg(order.orderStatus) }}>
              <i className={getStatusIcon(order.orderStatus)}></i>
              <span>{getStatusLabel(order.orderStatus)}</span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="status-timeline-section">
          {isCancelled ? (
            <div className="cancelled-status" style={{ textAlign: 'center', color: '#e74c3c' }}>
              <i className="fas fa-times-circle" style={{ fontSize: '36px', marginBottom: '8px' }}></i>
              <h3>Đơn hàng đã bị hủy</h3>
            </div>
          ) : (
            <div className="status-timeline">
              {statusFlow.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = order.orderStatus === status;
                return (
                  <div key={status} className={`timeline-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="timeline-icon">
                      {isActive ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <i className="far fa-circle"></i>
                      )}
                    </div>
                    <div className="timeline-label">{getStatusLabel(status)}</div>
                    {index < statusFlow.length - 1 && <div className="timeline-line"></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order & Shipping Info Cards Grid */}
        <div className="order-info-grid">
          <div className="info-box-card">
            <h3><i className="fas fa-map-marker-alt"></i> Địa chỉ nhận hàng</h3>
            <div className="info-field-row">
              <span className="info-field-label">Người nhận:</span>
              <span className="info-field-value">{order.shippingName}</span>
            </div>
            <div className="info-field-row">
              <span className="info-field-label">Số điện thoại:</span>
              <span className="info-field-value">{order.shippingPhone}</span>
            </div>
            <div className="info-field-row">
              <span className="info-field-label">Địa chỉ:</span>
              <span className="info-field-value">
                {order.shippingAddress}, {order.shippingDistrict}, {order.shippingCity}
              </span>
            </div>
            {order.notes && (
              <div className="info-field-row">
                <span className="info-field-label">Ghi chú:</span>
                <span className="info-field-value">{order.notes}</span>
              </div>
            )}
          </div>

          <div className="info-box-card">
            <h3><i className="fas fa-credit-card"></i> Thông tin thanh toán</h3>
            <div className="info-field-row">
              <span className="info-field-label">Ngày đặt hàng:</span>
              <span className="info-field-value">{formatDate(order.orderDate || order.createdAt)}</span>
            </div>
            <div className="info-field-row">
              <span className="info-field-label">Phương thức:</span>
              <span className="info-field-value">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}</span>
            </div>
            <div className="info-field-row">
              <span className="info-field-label">Trạng thái:</span>
              <span className="info-field-value" style={{ color: order.isPaid ? '#27ae60' : '#f39c12' }}>
                {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items Table Card */}
        <div className="order-items-box-card">
          <h3>Sản phẩm đã đặt</h3>
          <div className="items-list-container">
            {order.orderDetails?.map((item, index) => {
              const title = item.book?.name || item.book?.bookTitle || item.book?.title || item.bookTitle || item.name || item.title || 'Sản phẩm';
              const author = item.book?.author || item.author;
              const hasAuthor = author && author !== 'N/A';

              return (
                <div key={index} className="order-detail-product-row">
                  <img 
                    src={getDefaultProductImage(item.book)} 
                    alt={title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getCategoryFallbackImage(item.book);
                    }}
                    className="detail-product-img"
                  />
                  <div className="detail-product-info">
                    <h4 className="detail-product-title">{title}</h4>
                    {hasAuthor && <div className="detail-product-author">Tác giả: {author}</div>}
                    <div className="detail-product-qty">x{item.quantity}</div>
                  </div>
                  <div className="detail-product-prices">
                    <div className="detail-unit-price">{formatPrice(item.unitPrice || item.price)}</div>
                    <div className="detail-total-price">{formatPrice((item.unitPrice || item.price || 0) * item.quantity)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="order-summary-box-card">
          <div className="summary-calc-row">
            <span>Tạm tính:</span>
            <span>{formatPrice(order.subTotal || (order.totalAmount ? order.totalAmount - (order.shippingFee || 30000) : 0))}</span>
          </div>
          <div className="summary-calc-row">
            <span>Phí vận chuyển:</span>
            <span>{formatPrice(order.shippingFee || 30000)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="summary-calc-row">
              <span>Giảm giá:</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="summary-calc-row grand-total">
            <span>Tổng số tiền:</span>
            <span>{formatPrice(order.totalAmount || order.total || 0)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="order-actions">
          {canRequestReturn() && (
            <button className="btn-return" onClick={() => setShowReturnModal(true)}>
              <i className="fas fa-undo"></i>
              Yêu cầu hoàn hàng
            </button>
          )}
          
          {order.orderStatus === 'Delivered' && !order.returnRequest?.isRequested && (
            <>
              <button className="btn-reorder" onClick={() => navigate('/books')}>
                <i className="fas fa-redo"></i>
                Mua lại
              </button>
              {(() => {
                const unreviewedBook = order.orderDetails?.find(item => 
                  !getBookReview(item.book?._id)
                );
                
                if (unreviewedBook) {
                  return (
                    <button 
                      className="btn-review"
                      onClick={() => handleOpenReview(unreviewedBook.book)}
                    >
                      <i className="fas fa-star"></i>
                      Đánh giá sản phẩm
                    </button>
                  );
                } else {
                  return (
                    <button className="btn-reviewed" disabled>
                      <i className="fas fa-check-circle"></i>
                      Đã đánh giá
                    </button>
                  );
                }
              })()}
            </>
          )}
          
          {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
            <button className="btn-cancel-order" onClick={handleCancelOrder}>
              <i className="fas fa-times-circle"></i>
              <span>Hủy đơn hàng</span>
            </button>
          )}
        </div>

        {/* Return Request Status */}
        {order.returnRequest?.isRequested && (
          <div className="return-request-section">
            <h2>
              <i className="fas fa-undo"></i>
              Thông tin hoàn hàng
            </h2>
            <div className={`return-status-card status-${order.returnRequest.status.toLowerCase()}`}>
              <div className="return-status-header">
                <span className="status-badge">
                  {order.returnRequest.status === 'Pending' && 'Đang chờ xử lý'}
                  {order.returnRequest.status === 'Approved' && 'Đã chấp nhận'}
                  {order.returnRequest.status === 'Rejected' && 'Đã từ chối'}
                </span>
                <span className="request-date">
                  {formatDate(order.returnRequest.requestDate)}
                </span>
              </div>
              
              <div className="return-reason">
                <strong>Lý do:</strong>
                <p>{order.returnRequest.reason}</p>
              </div>

              {order.returnRequest.adminNote && (
                <div className="admin-response">
                  <strong>Phản hồi từ quản trị viên:</strong>
                  <p>{order.returnRequest.adminNote}</p>
                </div>
              )}

              {order.refundInfo?.isRefunded && (
                <div className="refund-info">
                  <h4>Thông tin hoàn tiền</h4>
                  <div className="refund-details">
                    <div className="refund-row">
                      <span>Số tiền hoàn:</span>
                      <span className="refund-amount">{formatPrice(order.refundInfo.refundAmount)}</span>
                    </div>
                    <div className="refund-row">
                      <span>Phương thức:</span>
                      <span>{order.refundInfo.refundMethod}</span>
                    </div>
                    <div className="refund-row">
                      <span>Ngày hoàn tiền:</span>
                      <span>{formatDate(order.refundInfo.refundDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showReturnModal && (
        <ReturnRequestModal
          order={order}
          onClose={() => setShowReturnModal(false)}
          onSubmit={handleReturnRequest}
        />
      )}
      
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={handleCloseReview}
        book={reviewModal.book}
        orderId={orderId}
        onSubmitSuccess={handleSubmitReview}
      />
    </div>
  );
}

export default UserOrderDetail;
