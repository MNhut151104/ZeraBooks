import React from 'react';
import { useCheckout } from '../features/checkout/hooks/useCheckout';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './Checkout.css';

function Checkout() {
  const {
    formData,
    errors,
    subtotal,
    shippingFee,
    total,
    cartItems,
    cities,
    districts,
    paymentMethods,
    handleInputChange,
    handleSubmit,
    formatPrice
  } = useCheckout();

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>
            <i className="fas fa-shopping-bag"></i> Thanh toán đơn hàng
          </h1>
          <p className="checkout-subtitle">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Left: Shipping Info & Payment */}
          <div className="checkout-form">
            {/* Shipping Information */}
            <div className="form-section">
              <h2>
                <i className="fas fa-shipping-fast"></i>
                Thông tin giao hàng
              </h2>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Số điện thoại <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0987654321"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Tỉnh/Thành phố <span className="required">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  >
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>
                    Quận/Huyện <span className="required">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={errors.district ? 'error' : ''}
                  >
                    <option value="">-- Chọn quận/huyện --</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <span className="error-message">{errors.district}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>
                    Địa chỉ <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Ghi chú đơn hàng (tùy chọn)</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="form-section">
              <h2>
                <i className="fas fa-credit-card"></i>
                Phương thức thanh toán
              </h2>

              <div className="payment-methods-grid">
                {paymentMethods.map(method => (
                  <label key={method.id} className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleInputChange}
                    />
                    <div className="payment-method-content">
                      <div className="payment-method-header">
                        <i className={method.icon}></i>
                        <span className="payment-method-name">{method.name}</span>
                      </div>
                      <p className="payment-method-description">{method.description}</p>
                    </div>
                    <div className="payment-method-check">
                      <i className="fas fa-check-circle"></i>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <aside className="order-summary">
            <div className="summary-card">
              <h3>Đơn hàng của bạn</h3>

              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item._id || item.book?._id} className="order-item">
                    <img
                      src={getDefaultProductImage(item.book)}
                      alt={item.book?.bookTitle || item.book?.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCategoryFallbackImage(item.book);
                      }}
                    />
                    <div className="order-item-info">
                      <h4>{item.book?.bookTitle || item.book?.name}</h4>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                    <div className="order-item-price">
                      {formatPrice((item.price || item.book?.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Tạm tính:</span>
                <span className="summary-value">{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span className="summary-value">{formatPrice(shippingFee)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span className="total-value">{formatPrice(total)}</span>
              </div>

              <button type="submit" className="place-order-btn">
                <i className="fas fa-check-circle"></i>
                Đặt hàng
              </button>

              <div className="security-note">
                <i className="fas fa-shield-alt"></i>
                <span>Thông tin của bạn được bảo mật</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
