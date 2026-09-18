export const cartAPI = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  
  addToCart: (book, quantity = 1) => {
    const cart = cartAPI.getCart();
    const existingItem = cart.find(item => item.book._id === book._id);
    const stockQuantity = book.stockQuantity ?? book.stock ?? existingItem?.book?.stockQuantity ?? existingItem?.book?.stock ?? 999;
    
    let limitReached = false;

    if (existingItem) {
      // Ensure existing item retains/updates stockQuantity
      existingItem.book.stockQuantity = stockQuantity;
      if (existingItem.quantity + quantity > stockQuantity) {
        existingItem.quantity = stockQuantity;
        limitReached = true;
      } else {
        existingItem.quantity += quantity;
      }
    } else {
      const initialQty = Math.min(quantity, stockQuantity);
      if (quantity > stockQuantity) {
        limitReached = true;
      }
      cart.push({
        _id: book._id,
        book: {
          _id: book._id,
          bookTitle: book.bookTitle,
          author: book.author,
          imageUrl: book.imageUrl,
          category: book.category,
          price: book.price,
          originalPrice: book.originalPrice,
          discountPercent: book.discountPercent,
          stockQuantity: stockQuantity
        },
        quantity: initialQty,
        price: book.price
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return { cart, limitReached, stockQuantity };
  },
  
  updateQuantity: (bookId, quantity) => {
    const cart = cartAPI.getCart();
    const item = cart.find(item => item.book._id === bookId);
    
    if (item) {
      const stockQuantity = item.book.stockQuantity ?? item.book.stock ?? 999;
      item.quantity = Math.min(Math.max(1, quantity), stockQuantity);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },
  
  removeFromCart: (bookId) => {
    const cart = cartAPI.getCart();
    const filteredCart = cart.filter(item => item.book._id !== bookId);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    return filteredCart;
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },
  
  getCartCount: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};
