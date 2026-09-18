import React, { useState } from 'react';
import './ReturnRequestModal.css';

function ReturnRequestModal({ order, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    reason: '',
    accountNumber: '',
    accountName: '',
    bankName: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason.trim()) {
      alert('Vui lòng nhập lý do hoàn hàng');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        reason: formData.reason,
        bankAccount: {
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          bankName: formData.bankName
        }
      });
      onClose();
    } catch (error) {
      console.error('Error submitting return request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-undo"></i>
            Yêu cầu hoàn hàng
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="info-notice">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Lưu ý:</strong>
              <p>Bạn chỉ có thể yêu cầu hoàn hàng trong vòng 7 ngày kể từ ngày nhận hàng.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reason">
                <i className="fas fa-comment-alt"></i>
                Lý do hoàn hàng <span className="required">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Vui lòng mô tả chi tiết lý do bạn muốn hoàn hàng..."
                rows="5"
                required
                maxLength="1000"
              />
              <small>{formData.reason.length}/1000 ký tự</small>
            </div>

            <div className="bank-info-section">
              <h3>
                <i className="fas fa-university"></i>
                Thông tin tài khoản nhận hoàn tiền
              </h3>
              <p className="section-note">Điền thông tin nếu bạn muốn nhận hoàn tiền qua chuyển khoản</p>

              <div className="form-group">
                <label htmlFor="bankName">Ngân hàng</label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Vietcombank, Techcombank..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountNumber">Số tài khoản</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số tài khoản"
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountName">Tên chủ tài khoản</label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên chủ tài khoản"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
                Hủy
              </button>
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Gửi yêu cầu
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

export default ReturnRequestModal;
