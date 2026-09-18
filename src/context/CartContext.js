import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load cart from localStorage on mount
    loadCart();
  }, []);

  useEffect(() => {
    // Update cart count whenever cart items change
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const loadCart = () => {
    const cart = cartAPI.getCart();
    setCartItems(cart);
  };

  const addToCart = (book, quantity = 1) => {
    const { cart: updatedCart, limitReached, stockQuantity } = cartAPI.addToCart(book, quantity);
    setCartItems(updatedCart);
    if (limitReached) {
      return {
        success: true,
        limitReached: true,
        message: `Số lượng sản phẩm trong giỏ hàng đã đạt giới hạn tối đa tồn kho (${stockQuantity} sản phẩm).`
      };
    }
    return { success: true, message: `Đã thêm "${book.bookTitle}" vào giỏ hàng` };
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartAPI.updateQuantity(bookId, quantity);
    setCartItems(updatedCart);
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cartAPI.removeFromCart(bookId);
    setCartItems(updatedCart);
    return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
  };

  const clearCart = () => {
    const updatedCart = cartAPI.clearCart();
    setCartItems(updatedCart);
    return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartCount;
  };

  const isInCart = (bookId) => {
    return cartItems.some(item => item.book._id === bookId);
  };

  const getItemQuantity = (bookId) => {
    const item = cartItems.find(item => item.book._id === bookId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
