import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleQuantityChange = (bookId, delta) => {
    const item = cartItems.find(item => item.book._id === bookId);
    if (item) {
      const maxStock = item.book.stockQuantity ?? item.book.stock ?? 999;
      const newQty = item.quantity + delta;
      if (newQty >= 1 && newQty <= maxStock) {
        updateQuantity(bookId, newQty);
      } else if (newQty > maxStock) {
        alert(`Rất tiếc, số lượng tồn kho tối đa chỉ còn ${maxStock} sản phẩm.`);
      }
    }
  };

  const handleRemoveItem = (bookId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeFromCart(bookId);
    }
  };

  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  const subtotal = getCartTotal();
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/books" className="continue-shopping-btn">
              <i className="fas fa-arrow-left"></i>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>
            <i className="fas fa-shopping-cart"></i> Giỏ hàng của bạn
          </h1>
          <p className="cart-subtitle">Bạn có {cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <span></span>
            </div>

            {cartItems.map(item => (
              <div key={item.book._id} className="cart-item">
                <div className="item-info">
                  <Link to={`/books/detail/${item.book._id}`} className="item-image">
                    <img
                      src={getDefaultProductImage(item.book)}
                      alt={item.book.bookTitle || item.book.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCategoryFallbackImage(item.book);
                      }}
                    />
                  </Link>
                  <div className="item-details">
                    <Link to={`/books/detail/${item.book._id}`} className="item-title">
                      {item.book.bookTitle}
                    </Link>
                    <p className="item-author">{item.book.author}</p>
                    {item.book.discountPercent > 0 && (
                      <div className="item-discount">
                        <span className="discount-badge">-{item.book.discountPercent}%</span>
                        <span className="original-price">{formatPrice(item.book.originalPrice)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  {formatPrice(item.price)}
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.book._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() => handleQuantityChange(item.book._id, 1)}
                      disabled={item.quantity >= (item.book.stockQuantity ?? item.book.stock ?? 999)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <div className="item-remove">
                  <button
                    onClick={() => handleRemoveItem(item.book._id)}
                    className="remove-btn"
                    title="Xóa sản phẩm"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/books" className="continue-shopping-link">
                <i className="fas fa-arrow-left"></i>
                Tiếp tục mua sắm
              </Link>
              <button className="clear-cart-btn" onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm?')) {
                  clearCart();
                }
              }}>
                <i className="fas fa-trash"></i>
                Xóa giỏ hàng
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="cart-summary">
            <div className="summary-card">
              <h3>Tổng thanh toán</h3>
              
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

              <button className="checkout-btn" onClick={handleCheckout}>
                <i className="fas fa-credit-card"></i>
                Tiến hành thanh toán
              </button>

              <div className="payment-methods">
                <p>Chúng tôi chấp nhận</p>
                <div className="payment-icons">
                  <i className="fas fa-money-bill-wave" title="Tiền mặt"></i>
                  <i className="fab fa-cc-visa" title="Visa"></i>
                  <i className="fab fa-cc-mastercard" title="Mastercard"></i>
                  <i className="fas fa-university" title="Chuyển khoản"></i>
                </div>
              </div>

              <div className="shipping-note">
                <i className="fas fa-truck"></i>
                <div>
                  <strong>Miễn phí vận chuyển</strong>
                  <p>Cho đơn hàng từ 300.000đ</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
