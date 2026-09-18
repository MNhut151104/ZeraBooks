import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ordersAPI } from '../services/api';
import ProcessReturnModal from '../components/ProcessReturnModal';
import { ORDER_STATUS } from '../config/constants';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './OrderDetail.css';

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');
  const [reason, setReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

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
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data.data?.order || response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Không thể tải thông tin đơn hàng');
      localStorage.setItem('adminActiveTab', 'orders');
      navigate('/admin/dashboard');
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
      [ORDER_STATUS.CANCELLED]: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getCurrentStatusIndex = () => {
    return statusFlow.indexOf(order?.orderStatus);
  };

  const isForwardTransition = (newStatus) => {
    const currentIndex = statusFlow.indexOf(order?.orderStatus);
    const newIndex = statusFlow.indexOf(newStatus);
    return newIndex > currentIndex;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (order.orderStatus === ORDER_STATUS.CANCELLED) {
      alert('Không thể cập nhật đơn hàng đã hủy');
      return;
    }

    if (order.orderStatus === ORDER_STATUS.DELIVERED) {
      alert('Đơn hàng đã được giao thành công');
      return;
    }

    if (!isForwardTransition(newStatus) && newStatus !== 'Cancelled') {
      setTargetStatus(newStatus);
      setShowReasonModal(true);
      return;
    }

    await performStatusUpdate(newStatus, null);
  };

  const performStatusUpdate = async (newStatus, updateReason) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { 
          status: newStatus,
          reason: updateReason,
          previousStatus: order.orderStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowReasonModal(false);
      setReason('');
      setTargetStatus('');
      await fetchOrderDetail();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể cập nhật trạng thái'));
    } finally {
      setUpdating(false);
    }
  };

  const handleReasonSubmit = () => {
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do cập nhật ngược trạng thái');
      return;
    }
    performStatusUpdate(targetStatus, reason);
  };

  const handleCancelOrder = () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    setTargetStatus(ORDER_STATUS.CANCELLED);
    setShowReasonModal(true);
  };

  const handleProcessReturn = async (returnData) => {
    try {
      await ordersAPI.processReturn(orderId, returnData);
      alert('Xử lý yêu cầu hoàn hàng thành công!');
      setShowReturnModal(false);
      await fetchOrderDetail();
    } catch (error) {
      console.error('Error processing return:', error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xử lý yêu cầu hoàn hàng'));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';
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
      <div className="admin-order-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-detail-page">
        <div className="error-container">
          <h2>Không tìm thấy đơn hàng</h2>
          <button onClick={() => {
            localStorage.setItem('adminActiveTab', 'orders');
            navigate('/admin/dashboard');
          }}>Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="admin-order-detail-page">
      <div className="admin-order-detail-container">
        
        {/* 1. Top Header Navigation Banner */}
        <div className="admin-order-header-card">
          <div className="header-left">
            <button className="back-btn" onClick={() => {
              localStorage.setItem('adminActiveTab', 'orders');
              navigate('/admin/dashboard');
            }}>
              <i className="fas fa-chevron-left"></i>
              <span>TRỞ VỀ DANH SÁCH ĐƠN HÀNG</span>
            </button>
          </div>
          <div className="header-center">
            <span className="code-label">MÃ ĐƠN HÀNG:</span>
            <span className="code-value">#{order.orderNumber || order._id}</span>
            <span className="order-time">• {formatDate(order.orderDate || order.createdAt)}</span>
          </div>
          <div className="header-right">
            <span className={`status-pill status-${order.orderStatus?.toLowerCase()}`}>
              <i className="fas fa-circle"></i>
              {getStatusLabel(order.orderStatus)}
            </span>
          </div>
        </div>

        {/* 2. Timeline Progress Stepper Card */}
        <div className="admin-stepper-card">
          <div className="stepper-wrapper">
            {statusFlow.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = order.orderStatus === status;
              return (
                <div key={status} className={`stepper-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="step-circle">
                    {isActive ? <i className="fas fa-check"></i> : index + 1}
                  </div>
                  <div className="step-label">{getStatusLabel(status)}</div>
                  {index < statusFlow.length - 1 && <div className="step-line"></div>}
                </div>
              );
            })}
          </div>

          {/* Action Toolbar */}
          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
            <div className="admin-action-toolbar">
              <span className="action-title"><i className="fas fa-sliders-h"></i> Thao tác quản lý:</span>
              <div className="action-buttons-group">
                {order.orderStatus === 'Pending' && (
                  <button className="btn-act btn-primary" onClick={() => handleStatusUpdate('Processing')} disabled={updating}>
                    <i className="fas fa-box"></i> Chuyển sang: Chờ lấy hàng
                  </button>
                )}
                {order.orderStatus === 'Processing' && (
                  <>
                    <button className="btn-act btn-primary" onClick={() => handleStatusUpdate('AwaitingShipment')} disabled={updating}>
                      <i className="fas fa-truck-loading"></i> Chuyển sang: Chờ giao hàng
                    </button>
                    <button className="btn-act btn-secondary" onClick={() => handleStatusUpdate('Pending')} disabled={updating}>
                      <i className="fas fa-undo"></i> Quay lại: Chờ xác nhận
                    </button>
                  </>
                )}
                {order.orderStatus === 'AwaitingShipment' && (
                  <>
                    <button className="btn-act btn-primary" onClick={() => handleStatusUpdate('Shipping')} disabled={updating}>
                      <i className="fas fa-shipping-fast"></i> Chuyển sang: Đang giao hàng
                    </button>
                    <button className="btn-act btn-secondary" onClick={() => handleStatusUpdate('Processing')} disabled={updating}>
                      <i className="fas fa-undo"></i> Quay lại: Chờ lấy hàng
                    </button>
                  </>
                )}
                {order.orderStatus === 'Shipping' && (
                  <>
                    <button className="btn-act btn-success" onClick={() => handleStatusUpdate('Delivered')} disabled={updating}>
                      <i className="fas fa-check-circle"></i> Chuyển sang: Đã giao
                    </button>
                    <button className="btn-act btn-secondary" onClick={() => handleStatusUpdate('AwaitingShipment')} disabled={updating}>
                      <i className="fas fa-undo"></i> Quay lại: Chờ giao hàng
                    </button>
                  </>
                )}
                <button className="btn-act btn-danger" onClick={handleCancelOrder} disabled={updating}>
                  <i className="fas fa-times-circle"></i> Hủy đơn hàng
                </button>
                {order.returnRequest?.isRequested && order.returnRequest?.status === 'Pending' && (
                  <button className="btn-act btn-warning" onClick={() => setShowReturnModal(true)}>
                    <i className="fas fa-undo-alt"></i> Xử lý hoàn hàng
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Main 2-Column Grid Layout (68% | 32%) */}
        <div className="admin-detail-body-grid">
          
          {/* Left Main Column */}
          <div className="admin-main-column">
            
            {/* Order Items Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3><i className="fas fa-boxes"></i> Sản phẩm đã đặt</h3>
                <span className="items-count">{order.orderDetails?.length || 0} sản phẩm</span>
              </div>
              
              <div className="admin-table-wrapper">
                <table className="admin-items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">Đơn giá</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-center">Giảm giá</th>
                      <th className="text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderDetails?.map((item, index) => {
                      const productName = item.book?.name || item.book?.bookTitle || item.book?.title || item.bookTitle || item.name || item.title || 'Sản phẩm';
                      const productAuthor = item.book?.author || item.author;
                      const productImage = getDefaultProductImage(item.book);

                      return (
                        <tr key={index}>
                          <td>
                            <div className="item-product-flex">
                              <img 
                                src={productImage} 
                                alt={productName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = getCategoryFallbackImage(item.book);
                                }}
                                className="item-thumb"
                              />
                              <div className="item-meta">
                                <span className="item-title">{productName}</span>
                                {productAuthor && <span className="item-author">Tác giả: {productAuthor}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{formatPrice(item.unitPrice || item.price)}</td>
                          <td className="text-center font-bold">x{item.quantity}</td>
                          <td className="text-center">{item.discountPercent || 0}%</td>
                          <td className="text-right font-bold">{formatPrice(item.totalPrice || ((item.unitPrice || item.price || 0) * item.quantity))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Footer */}
              <div className="financial-summary-card">
                <div className="fin-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(order.subTotal || (order.totalAmount ? order.totalAmount - (order.shippingFee || 30000) : 0))}</span>
                </div>
                <div className="fin-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(order.shippingFee || 30000)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="fin-row fin-discount">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="fin-row fin-total">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="total-val">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Status History Timeline Card */}
            {order.statusLog && order.statusLog.length > 0 && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3><i className="fas fa-history"></i> Lịch sử thay đổi trạng thái</h3>
                </div>
                <div className="admin-log-timeline">
                  {order.statusLog.map((log, index) => (
                    <div key={index} className="log-node">
                      <div className="log-node-dot"></div>
                      <div className="log-node-body">
                        <div className="log-node-header">
                          <span className="log-transition">
                            {log.previousStatus && `${getStatusLabel(log.previousStatus)} → `}
                            <strong>{getStatusLabel(log.status)}</strong>
                          </span>
                          <span className="log-time">{formatDate(log.timestamp)}</span>
                        </div>
                        {log.reason && (
                          <div className="log-reason-box">
                            <i className="fas fa-comment-alt"></i> Lý do: {log.reason}
                          </div>
                        )}
                        {log.updatedBy && (
                          <span className="log-actor">Thực hiện bởi: {log.updatedBy.fullName || log.updatedBy.email || 'Hệ thống'}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Return Request Card */}
            {order.returnRequest?.isRequested && (
              <div className="admin-card return-card shadow-warning">
                <div className="admin-card-header">
                  <h3><i className="fas fa-undo-alt"></i> Yêu cầu hoàn hàng</h3>
                  <span className={`status-badge return-${order.returnRequest.status?.toLowerCase()}`}>
                    {order.returnRequest.status === 'Pending' && 'Chờ xử lý'}
                    {order.returnRequest.status === 'Approved' && 'Đã duyệt'}
                    {order.returnRequest.status === 'Rejected' && 'Đã từ chối'}
                  </span>
                </div>
                <div className="return-card-content">
                  <p><strong>Ngày gửi yêu cầu:</strong> {formatDate(order.returnRequest.requestDate)}</p>
                  <p><strong>Lý do yêu cầu:</strong> {order.returnRequest.reason}</p>
                  
                  {order.returnRequest.bankAccount && (
                    <div className="bank-info-box">
                      <h4>Thông tin tài khoản nhận tiền:</h4>
                      <p><strong>Số tài khoản:</strong> {order.returnRequest.bankAccount.accountNumber}</p>
                      <p><strong>Chủ tài khoản:</strong> {order.returnRequest.bankAccount.accountName}</p>
                      <p><strong>Ngân hàng:</strong> {order.returnRequest.bankAccount.bankName}</p>
                    </div>
                  )}

                  {order.returnRequest.status !== 'Pending' && (
                    <div className="admin-note-box">
                      <p><strong>Phản hồi từ Admin:</strong> {order.returnRequest.adminNote || 'Đã xử lý'}</p>
                      {order.returnRequest.processedDate && (
                        <small>Xử lý ngày: {formatDate(order.returnRequest.processedDate)}</small>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Column */}
          <div className="admin-sidebar-column">

            {/* Customer Info Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3><i className="fas fa-user-circle"></i> Thông tin khách hàng</h3>
              </div>
              <div className="card-info-list">
                <div className="info-item">
                  <span className="lbl">Họ và tên:</span>
                  <span className="val font-semibold">{order.customer?.fullName || order.shippingName || 'Khách vãng lai'}</span>
                </div>
                <div className="info-item">
                  <span className="lbl">Email:</span>
                  <span className="val">{order.customer?.email || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="lbl">Số điện thoại:</span>
                  <span className="val font-semibold">{order.shippingPhone || order.customer?.phone || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="lbl">Loại tài khoản:</span>
                  <span className="val badge-tag">{order.customer ? 'Khách hàng thành viên' : 'Khách hàng vãng lai'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3><i className="fas fa-map-marked-alt"></i> Địa chỉ nhận hàng</h3>
              </div>
              <div className="card-info-list">
                <div className="info-item">
                  <span className="lbl">Người nhận:</span>
                  <span className="val font-semibold">{order.shippingName}</span>
                </div>
                <div className="info-item">
                  <span className="lbl">Điện thoại liên hệ:</span>
                  <span className="val font-semibold">{order.shippingPhone}</span>
                </div>
                <div className="info-item full-col">
                  <span className="lbl">Địa chỉ chi tiết:</span>
                  <span className="val address-val">
                    {order.shippingAddress}, {order.shippingDistrict}, {order.shippingCity}
                  </span>
                </div>
                {order.notes && (
                  <div className="info-item full-col">
                    <span className="lbl">Ghi chú từ khách:</span>
                    <span className="val note-val">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Logistics Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3><i className="fas fa-credit-card"></i> Thanh toán & Vận chuyển</h3>
              </div>
              <div className="card-info-list">
                <div className="info-item">
                  <span className="lbl">Phương thức:</span>
                  <span className="val font-semibold">{order.paymentMethod || 'COD'}</span>
                </div>
                <div className="info-item">
                  <span className="lbl">Trạng thái thanh toán:</span>
                  <span className={`val pay-badge ${order.isPaid ? 'is-paid' : 'is-unpaid'}`}>
                    {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="lbl">Phí vận chuyển:</span>
                  <span className="val">{formatPrice(order.shippingFee || 30000)}</span>
                </div>
                {order.deliveryDate && (
                  <div className="info-item">
                    <span className="lbl">Ngày giao thành công:</span>
                    <span className="val">{formatDate(order.deliveryDate)}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="modal-overlay" onClick={() => setShowReasonModal(false)}>
          <div className="reason-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box-header">
              <h3><i className="fas fa-exclamation-triangle"></i> Xác nhận thay đổi trạng thái</h3>
              <button className="close-btn" onClick={() => setShowReasonModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-box-body">
              <p>
                Bạn đang {targetStatus === 'Cancelled' ? 'hủy đơn hàng' : 'cập nhật ngược trạng thái đơn hàng'}.
                Vui lòng nhập lý do để ghi nhận vào lịch sử:
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do chi tiết..."
                rows="4"
                autoFocus
              />
            </div>
            <div className="modal-box-footer">
              <button 
                className="btn-modal btn-cancel" 
                onClick={() => {
                  setShowReasonModal(false);
                  setReason('');
                  setTargetStatus('');
                }}
                disabled={updating}
              >
                Hủy bỏ
              </button>
              <button 
                className="btn-modal btn-confirm" 
                onClick={handleReasonSubmit}
                disabled={updating || !reason.trim()}
              >
                {updating ? 'Đang xử lý...' : 'Xác nhận cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Return Modal */}
      {showReturnModal && (
        <ProcessReturnModal
          order={order}
          onClose={() => setShowReturnModal(false)}
          onSubmit={handleProcessReturn}
        />
      )}
    </div>
  );
}

export default OrderDetail;
