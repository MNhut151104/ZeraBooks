import React, { useState } from 'react';
import './ProcessReturnModal.css';

function ProcessReturnModal({ order, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    status: 'Approved',
    adminNote: '',
    refundAmount: order.totalAmount || 0,
    refundMethod: 'Original Payment Method'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.adminNote.trim() && formData.status === 'Rejected') {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error processing return:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="process-return-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-tasks"></i>
            Xử lý yêu cầu hoàn hàng
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="order-info">
            <h3>Thông tin đơn hàng</h3>
            <div className="info-row">
              <span>Mã đơn hàng:</span>
              <strong>#{order._id?.slice(-8)}</strong>
            </div>
            <div className="info-row">
              <span>Khách hàng:</span>
              <strong>{order.customer?.fullName}</strong>
            </div>
            <div className="info-row">
              <span>Tổng tiền:</span>
              <strong className="amount">{formatPrice(order.totalAmount)}</strong>
            </div>
            <div className="info-row">
              <span>Ngày giao:</span>
              <strong>{order.deliveryDate ? formatDate(order.deliveryDate) : 'N/A'}</strong>
            </div>
          </div>

          <div className="return-request-info">
            <h3>Yêu cầu hoàn hàng</h3>
            <div className="info-row">
              <span>Ngày yêu cầu:</span>
              <strong>{formatDate(order.returnRequest?.requestDate)}</strong>
            </div>
            <div className="reason-box">
              <strong>Lý do từ khách hàng:</strong>
              <p>{order.returnRequest?.reason}</p>
            </div>
            
            {order.refundInfo?.bankAccount?.accountNumber && (
              <div className="bank-info-box">
                <strong>Thông tin tài khoản:</strong>
                <p>Ngân hàng: {order.refundInfo.bankAccount.bankName}</p>
                <p>Số TK: {order.refundInfo.bankAccount.accountNumber}</p>
                <p>Chủ TK: {order.refundInfo.bankAccount.accountName}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="status">
                Quyết định <span className="required">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Approved">Chấp nhận hoàn hàng</option>
                <option value="Rejected">Từ chối hoàn hàng</option>
              </select>
            </div>

            {formData.status === 'Approved' && (
              <>
                <div className="form-group">
                  <label htmlFor="refundAmount">
                    Số tiền hoàn <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="refundAmount"
                    name="refundAmount"
                    value={formData.refundAmount}
                    onChange={handleInputChange}
                    min="0"
                    max={order.totalAmount}
                    required
                  />
                  <small>Tối đa: {formatPrice(order.totalAmount)}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="refundMethod">
                    Phương thức hoàn tiền <span className="required">*</span>
                  </label>
                  <select
                    id="refundMethod"
                    name="refundMethod"
                    value={formData.refundMethod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Original Payment Method">Phương thức thanh toán gốc</option>
                    <option value="Bank Transfer">Chuyển khoản ngân hàng</option>
                    <option value="Cash">Tiền mặt</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="adminNote">
                Ghi chú {formData.status === 'Rejected' && <span className="required">*</span>}
              </label>
              <textarea
                id="adminNote"
                name="adminNote"
                value={formData.adminNote}
                onChange={handleInputChange}
                placeholder="Nhập lý do và ghi chú của bạn..."
                rows="4"
                required={formData.status === 'Rejected'}
                maxLength="500"
              />
              <small>{formData.adminNote.length}/500 ký tự</small>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
                Hủy
              </button>
              <button 
                type="submit" 
                className={`btn-submit ${formData.status === 'Approved' ? 'approve' : 'reject'}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className={`fas fa-${formData.status === 'Approved' ? 'check' : 'times'}`}></i>
                    {formData.status === 'Approved' ? 'Chấp nhận' : 'Từ chối'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProcessReturnModal;
