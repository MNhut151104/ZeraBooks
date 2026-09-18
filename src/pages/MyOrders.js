import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ReviewModal from '../components/ReviewModal';
import { ORDER_STATUS } from '../config/constants';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './MyOrders.css';

function MyOrders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    book: null,
    orderId: null
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersResponse = await ordersAPI.getMyOrders();
      const ordersData = ordersResponse.data.data?.orders || ordersResponse.data.orders || [];
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return { label: 'CHỜ XÁC NHẬN', color: '#f39c12', icon: 'fas fa-clock', badgeBg: '#fff8e7' };
      case ORDER_STATUS.PROCESSING:
        return { label: 'ĐANG XỬ LÝ', color: '#3498db', icon: 'fas fa-box', badgeBg: '#e3f2fd' };
      case ORDER_STATUS.AWAITING_SHIPMENT:
      case ORDER_STATUS.SHIPPING:
        return { label: 'ĐANG GIAO HÀNG', color: '#2980b9', icon: 'fas fa-truck', badgeBg: '#e1f5fe' };
      case ORDER_STATUS.DELIVERED:
        return { label: 'HOÀN THÀNH', color: '#27ae60', icon: 'fas fa-check-circle', badgeBg: '#e8f5e9' };
      case ORDER_STATUS.CANCELLED:
        return { label: 'ĐÃ HỦY', color: '#e74c3c', icon: 'fas fa-times-circle', badgeBg: '#ffebee' };
      default:
        return { label: 'CHỜ XỬ LÝ', color: '#f39c12', icon: 'fas fa-clock', badgeBg: '#fff8e7' };
    }
  };

  const getCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.orderStatus === ORDER_STATUS.PENDING).length,
      processing: orders.filter(o => o.orderStatus === ORDER_STATUS.PROCESSING).length,
      shipping: orders.filter(o => [ORDER_STATUS.SHIPPING, ORDER_STATUS.AWAITING_SHIPMENT].includes(o.orderStatus)).length,
      delivered: orders.filter(o => o.orderStatus === ORDER_STATUS.DELIVERED).length,
      cancelled: orders.filter(o => o.orderStatus === ORDER_STATUS.CANCELLED).length
    };
  };

  const getFilteredOrders = () => {
    let result = orders;
    if (activeFilter === ORDER_STATUS.PENDING) {
      result = result.filter(o => o.orderStatus === ORDER_STATUS.PENDING);
    } else if (activeFilter === ORDER_STATUS.PROCESSING) {
      result = result.filter(o => o.orderStatus === ORDER_STATUS.PROCESSING);
    } else if (activeFilter === ORDER_STATUS.SHIPPING) {
      result = result.filter(o => [ORDER_STATUS.SHIPPING, ORDER_STATUS.AWAITING_SHIPMENT].includes(o.orderStatus));
    } else if (activeFilter === ORDER_STATUS.DELIVERED) {
      result = result.filter(o => o.orderStatus === ORDER_STATUS.DELIVERED);
    } else if (activeFilter === ORDER_STATUS.CANCELLED) {
      result = result.filter(o => o.orderStatus === ORDER_STATUS.CANCELLED);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => {
        const orderNum = (o.orderNumber || o._id || '').toLowerCase();
        const hasMatchingProduct = o.orderDetails?.some(item => {
          const title = (item.book?.bookTitle || item.book?.name || item.bookTitle || '').toLowerCase();
          return title.includes(q);
        });
        return orderNum.includes(q) || hasMatchingProduct;
      });
    }

    return result;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      await ordersAPI.cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công!');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại sau.');
    }
  };

  const handleReorder = (order) => {
    try {
      order.orderDetails.forEach(item => {
        if (item.book) {
          addToCart(item.book, item.quantity);
        }
      });
      alert('Đã thêm các sản phẩm vào giỏ hàng!');
      navigate('/cart');
    } catch (err) {
      alert('Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  const counts = getCounts();
  const filteredOrders = getFilteredOrders();

  return (
    <div className="my-orders-page">
      <div className="orders-container">
        
        {/* Top Header Tabs - Standard E-Commerce Style */}
        <div className="orders-nav-tabs">
          <button 
            className={`nav-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Tất cả <span className="tab-count">({counts.all})</span>
          </button>
          <button 
            className={`nav-tab ${activeFilter === ORDER_STATUS.PENDING ? 'active' : ''}`}
            onClick={() => setActiveFilter(ORDER_STATUS.PENDING)}
          >
            Chờ xác nhận {counts.pending > 0 && <span className="tab-count">({counts.pending})</span>}
          </button>
          <button 
            className={`nav-tab ${activeFilter === ORDER_STATUS.PROCESSING ? 'active' : ''}`}
            onClick={() => setActiveFilter(ORDER_STATUS.PROCESSING)}
          >
            Đang xử lý {counts.processing > 0 && <span className="tab-count">({counts.processing})</span>}
          </button>
          <button 
            className={`nav-tab ${activeFilter === ORDER_STATUS.SHIPPING ? 'active' : ''}`}
            onClick={() => setActiveFilter(ORDER_STATUS.SHIPPING)}
          >
            Đang giao {counts.shipping > 0 && <span className="tab-count">({counts.shipping})</span>}
          </button>
          <button 
            className={`nav-tab ${activeFilter === ORDER_STATUS.DELIVERED ? 'active' : ''}`}
            onClick={() => setActiveFilter(ORDER_STATUS.DELIVERED)}
          >
            Hoàn thành {counts.delivered > 0 && <span className="tab-count">({counts.delivered})</span>}
          </button>
          <button 
            className={`nav-tab ${activeFilter === ORDER_STATUS.CANCELLED ? 'active' : ''}`}
            onClick={() => setActiveFilter(ORDER_STATUS.CANCELLED)}
          >
            Đã hủy {counts.cancelled > 0 && <span className="tab-count">({counts.cancelled})</span>}
          </button>
        </div>

        {/* Search Bar */}
        <div className="orders-search-box">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text"
            placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="orders-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchOrders} className="retry-btn">Thử lại</button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <h3>Chưa có đơn hàng</h3>
            <p>{searchQuery ? 'Không tìm thấy đơn hàng phù hợp với từ khóa.' : 'Bạn chưa có đơn hàng nào trong mục này.'}</p>
            <button className="shop-btn" onClick={() => navigate('/books')}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="orders-card-list">
            {filteredOrders.map(order => {
              const statusCfg = getStatusConfig(order.orderStatus);
              const totalItems = order.orderDetails?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

              return (
                <div key={order._id} className="order-item-card">
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="shop-info">
                      <i className="fas fa-store shop-icon"></i>
                      <span className="shop-name">Zera Books</span>
                      <span className="order-code">Mã đơn: #{order.orderNumber || order._id.slice(-8)}</span>
                      <span className="order-time">{formatDate(order.createdAt || order.orderDate)}</span>
                    </div>
                    <div className="status-badge" style={{ color: statusCfg.color }}>
                      <i className={statusCfg.icon}></i>
                      <span>{statusCfg.label}</span>
                    </div>
                  </div>

                  {/* Card Body - Products List */}
                  <div className="card-body" onClick={() => navigate(`/orders/${order._id}`)}>
                    {order.orderDetails?.map((item, idx) => {
                      const title = item.book?.bookTitle || item.book?.name || item.bookTitle || 'Sản phẩm';
                      const author = item.book?.author || item.author;
                      const hasAuthor = author && author !== 'N/A';

                      return (
                        <div key={idx} className="product-row">
                          <img 
                            src={getDefaultProductImage(item.book)}
                            alt={title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getCategoryFallbackImage(item.book);
                            }}
                            className="product-thumb"
                          />
                          <div className="product-meta">
                            <h4 className="product-title">{title}</h4>
                            {hasAuthor && <span className="product-author">Tác giả: {author}</span>}
                            <span className="product-qty">x{item.quantity}</span>
                          </div>
                          <div className="product-price">
                            {formatPrice(item.unitPrice || item.price || 0)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="total-row">
                      <span className="total-label">Thành tiền ({totalItems} sản phẩm):</span>
                      <span className="total-amount">{formatPrice(order.totalAmount || order.total || 0)}</span>
                    </div>

                    <div className="actions-row">
                      <button 
                        className="btn-action btn-outline"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        Chi tiết đơn hàng
                      </button>

                      {order.orderStatus === ORDER_STATUS.DELIVERED && (
                        <>
                          <button 
                            className="btn-action btn-primary"
                            onClick={() => handleReorder(order)}
                          >
                            Mua lại
                          </button>
                        </>
                      )}

                      {(order.orderStatus === ORDER_STATUS.PENDING || order.orderStatus === ORDER_STATUS.PROCESSING) && (
                        <button 
                          className="btn-action btn-danger"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, book: null, orderId: null })}
        book={reviewModal.book}
        orderId={reviewModal.orderId}
        onSubmitSuccess={fetchOrders}
      />
    </div>
  );
}

export default MyOrders;
