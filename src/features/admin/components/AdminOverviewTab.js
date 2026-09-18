import React from 'react';

export function AdminOverviewTab({ setActiveTab, handleOpenBookModal }) {
  return (
    <div className="dashboard-view">
      <div className="quick-actions">
        <h3>Thao tác nhanh</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => { setActiveTab('books'); setTimeout(() => handleOpenBookModal(), 100); }}>
            <i className="fa-solid fa-plus"></i> Thêm sản phẩm mới
          </button>
          <button className="action-btn" onClick={() => setActiveTab('orders')}>
            <i className="fa-solid fa-list"></i> Xem đơn hàng
          </button>
          <button className="action-btn" onClick={() => setActiveTab('customers')}>
            <i className="fa-solid fa-users"></i> Khách hàng
          </button>
          <button className="action-btn" onClick={() => setActiveTab('reviews')}>
            <i className="fa-solid fa-star"></i> Đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
