import React, { useState } from 'react';
import { ORDER_STATUS } from '../../../config/constants';

export function AdminOrdersTab({
  orders,
  loading,
  formatPrice,
  formatDate,
  navigate
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusLabel = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return 'Chờ xác nhận';
      case ORDER_STATUS.PROCESSING: return 'Chờ lấy hàng';
      case ORDER_STATUS.SHIPPING: return 'Đang giao hàng';
      case ORDER_STATUS.DELIVERED: return 'Đã giao';
      case ORDER_STATUS.CANCELLED: return 'Đã hủy';
      case ORDER_STATUS.AWAITING_SHIPMENT: return 'Chờ giao hàng';
      default: return status || '';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const orderId = (order._id || '').toLowerCase();
    const shortId = orderId.slice(-8);
    const customerName = (order.customer?.fullName || order.shippingName || '').toLowerCase();
    const phone = (order.phone || order.customer?.phone || '').toLowerCase();
    const address = (order.shippingAddress || '').toLowerCase();
    const statusText = getStatusLabel(order.orderStatus).toLowerCase();

    return orderId.includes(term) || 
           shortId.includes(term) || 
           customerName.includes(term) || 
           phone.includes(term) || 
           address.includes(term) || 
           statusText.includes(term);
  });

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Quản lý đơn hàng ({filteredOrders.length}{searchTerm ? ` / ${orders.length}` : ''})</h2>
        
        <div className="admin-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm mã đơn, tên KH, SĐT, trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="admin-search-clear" onClick={() => setSearchTerm('')} title="Xóa tìm kiếm">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">
                    <i className="fa-solid fa-receipt"></i>
                    {searchTerm 
                      ? `Không tìm thấy đơn hàng nào phù hợp với từ khóa "${searchTerm}"`
                      : 'Chưa có đơn hàng nào'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td><strong>#{order._id.slice(-8)}</strong></td>
                    <td>{order.customer?.fullName || order.shippingName || 'N/A'}</td>
                    <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                    <td>
                      <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus === ORDER_STATUS.PENDING && 'Chờ xác nhận'}
                        {order.orderStatus === ORDER_STATUS.PROCESSING && 'Chờ lấy hàng'}
                        {order.orderStatus === ORDER_STATUS.SHIPPING && 'Đang giao hàng'}
                        {order.orderStatus === ORDER_STATUS.DELIVERED && 'Đã giao'}
                        {order.orderStatus === ORDER_STATUS.CANCELLED && 'Đã hủy'}
                        {order.orderStatus === ORDER_STATUS.AWAITING_SHIPMENT && 'Chờ giao hàng'}
                      </span>
                    </td>
                    <td>{formatDate(order.orderDate || order.createdAt)}</td>
                    <td>
                      <button 
                        className="btn-view" 
                        title="Quản lý"
                        onClick={() => {
                          localStorage.setItem('adminActiveTab', 'orders');
                          navigate(`/admin/orders/${order._id}`);
                        }}
                      >
                        <i className="fa-solid fa-clipboard-list"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
