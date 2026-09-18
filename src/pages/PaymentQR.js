import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentQR.css';

function PaymentQR() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  const [isPaid, setIsPaid] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getPaymentMethodInfo = () => {
    const paymentMethod = orderData.paymentMethod || 'BANK';
    const methods = {
      BANK: {
        name: 'Chuyển khoản ngân hàng',
        icon: 'fas fa-university',
        color: '#3498db',
        qrNote: 'Quét mã QR để chuyển khoản',
        bankInfo: {
          bank: 'Ngân hàng TMCP Á Châu (ACB)',
          accountNumber: '123456789',
          accountName: 'ZERA BOOKS',
          branch: 'Chi nhánh TP.HCM'
        }
      },
      CARD: {
        name: 'Thẻ tín dụng/ghi nợ',
        icon: 'fas fa-credit-card',
        color: '#9b59b6',
        qrNote: 'Quét mã QR để thanh toán',
        bankInfo: null
      },
      MOMO: {
        name: 'Ví MoMo',
        icon: 'fas fa-wallet',
        color: '#a50064',
        qrNote: 'Mở ứng dụng MoMo và quét mã QR',
        bankInfo: {
          phone: '0987654321',
          name: 'ZERA BOOKS'
        }
      },
      ZALOPAY: {
        name: 'ZaloPay',
        icon: 'fas fa-mobile-alt',
        color: '#0068FF',
        qrNote: 'Mở ứng dụng ZaloPay và quét mã QR',
        bankInfo: {
          phone: '0987654321',
          name: 'ZERA BOOKS'
        }
      }
    };
    return methods[paymentMethod] || methods.BANK;
  };

  const paymentInfo = getPaymentMethodInfo();

  const handlePaymentConfirm = () => {
    setIsPaid(true);
    setTimeout(() => {
      navigate('/order-success', { 
        state: { 
          ...orderData, 
          paymentMethod: paymentInfo.name,
          orderNumber: orderData.orderNumber || Math.floor(Math.random() * 1000000)
        } 
      });
    }, 1500);
  };

  return (
    <div className="payment-qr-page">
      <div className="container">
        <div className="payment-card">
          <div className="payment-header">
            <div className="payment-method-badge" style={{ backgroundColor: paymentInfo.color }}>
              <i className={paymentInfo.icon}></i>
            </div>
            <h1>{paymentInfo.name}</h1>
            <p className="payment-subtitle">{paymentInfo.qrNote}</p>
          </div>

          <div className="order-summary-box">
            <div className="order-number-badge">
              <i className="fas fa-receipt"></i>
              <span>Đơn hàng #{orderData.orderNumber || Math.floor(Math.random() * 1000000)}</span>
            </div>
            
            <div className="amount-to-pay">
              <span className="label">Số tiền cần thanh toán</span>
              <span className="amount">{formatPrice(orderData.total || 257000)}</span>
            </div>
          </div>

          <div className="qr-code-section">
            <div className="qr-code-wrapper">
              <div className="qr-code-frame">
                {/* QR Code giả lập */}
                <svg viewBox="0 0 200 200" className="qr-code">
                  <rect width="200" height="200" fill="white"/>
                  <g fill="black">
                    {/* Tạo pattern giống QR code */}
                    {Array.from({ length: 15 }).map((_, i) =>
                      Array.from({ length: 15 }).map((_, j) => (
                        Math.random() > 0.5 && (
                          <rect
                            key={`${i}-${j}`}
                            x={10 + i * 12}
                            y={10 + j * 12}
                            width="10"
                            height="10"
                          />
                        )
                      ))
                    )}
                    {/* 3 góc QR code */}
                    <rect x="10" y="10" width="40" height="40" fill="none" stroke="black" strokeWidth="8"/>
                    <rect x="150" y="10" width="40" height="40" fill="none" stroke="black" strokeWidth="8"/>
                    <rect x="10" y="150" width="40" height="40" fill="none" stroke="black" strokeWidth="8"/>
                    <rect x="20" y="20" width="20" height="20"/>
                    <rect x="160" y="20" width="20" height="20"/>
                    <rect x="20" y="160" width="20" height="20"/>
                  </g>
                </svg>
                <div className="scan-line"></div>
              </div>
              
              <div className="qr-instructions">
                <i className="fas fa-camera"></i>
                <span>Quét mã QR bằng ứng dụng {paymentInfo.name}</span>
              </div>
            </div>
          </div>

          {paymentInfo.bankInfo && (
            <div className="bank-info-section">
              <h3>
                <i className="fas fa-info-circle"></i>
                Thông tin {paymentInfo.name === 'Chuyển khoản ngân hàng' ? 'chuyển khoản' : 'tài khoản'}
              </h3>
              <div className="bank-info-grid">
                {paymentInfo.bankInfo.bank && (
                  <div className="info-item">
                    <span className="info-label">Ngân hàng</span>
                    <span className="info-value">{paymentInfo.bankInfo.bank}</span>
                  </div>
                )}
                {paymentInfo.bankInfo.accountNumber && (
                  <div className="info-item">
                    <span className="info-label">Số tài khoản</span>
                    <span className="info-value copiable">
                      {paymentInfo.bankInfo.accountNumber}
                      <button className="copy-btn" title="Sao chép">
                        <i className="fas fa-copy"></i>
                      </button>
                    </span>
                  </div>
                )}
                {paymentInfo.bankInfo.accountName && (
                  <div className="info-item">
                    <span className="info-label">Chủ tài khoản</span>
                    <span className="info-value">{paymentInfo.bankInfo.accountName}</span>
                  </div>
                )}
                {paymentInfo.bankInfo.branch && (
                  <div className="info-item">
                    <span className="info-label">Chi nhánh</span>
                    <span className="info-value">{paymentInfo.bankInfo.branch}</span>
                  </div>
                )}
                {paymentInfo.bankInfo.phone && (
                  <div className="info-item">
                    <span className="info-label">Số điện thoại</span>
                    <span className="info-value">{paymentInfo.bankInfo.phone}</span>
                  </div>
                )}
                {paymentInfo.bankInfo.name && !paymentInfo.bankInfo.accountName && (
                  <div className="info-item">
                    <span className="info-label">Tên tài khoản</span>
                    <span className="info-value">{paymentInfo.bankInfo.name}</span>
                  </div>
                )}
                <div className="info-item full-width">
                  <span className="info-label">Nội dung chuyển khoản</span>
                  <span className="info-value copiable highlight">
                    DH{orderData.orderNumber || Math.floor(Math.random() * 1000000)}
                    <button className="copy-btn" title="Sao chép">
                      <i className="fas fa-copy"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="payment-notes">
            <div className="note-item">
              <i className="fas fa-exclamation-circle"></i>
              <span>Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng</span>
            </div>
            <div className="note-item">
              <i className="fas fa-clock"></i>
              <span>Đơn hàng sẽ tự động hủy sau 15 phút nếu không nhận được thanh toán</span>
            </div>
          </div>

          {!isPaid ? (
            <button 
              className="confirm-payment-btn"
              onClick={handlePaymentConfirm}
            >
              <i className="fas fa-check-circle"></i>
              Tôi đã thanh toán
            </button>
          ) : (
            <div className="payment-processing">
              <div className="spinner"></div>
              <span>Đang xác nhận thanh toán...</span>
            </div>
          )}

          <button 
            className="back-btn"
            onClick={() => navigate('/checkout')}
          >
            <i className="fas fa-arrow-left"></i>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentQR;
