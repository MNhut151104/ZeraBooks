import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';

export function BookCard({ book }) {
  if (!book) return null;

  const discountPercent = book.discountPercent > 0
    ? book.discountPercent
    : (book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0);

  const originalPrice = book.originalPrice || (discountPercent > 0 ? Math.round(book.price / (1 - discountPercent / 100)) : null);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const soldCount = book.soldQuantity !== undefined ? book.soldQuantity : (book.soldCount || 0);
  const reviewCount = book.reviewCount || book.numReviews || 0;
  const averageRating = book.averageRating || 0;
  const hasReviews = reviewCount > 0 && averageRating > 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  return (
    <Link to={`/books/detail/${book._id}`} className="book-card" onClick={() => window.scrollTo(0, 0)}>
      <div className="book-image">
        <img
          src={getDefaultProductImage(book)}
          alt={book.bookTitle || book.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getCategoryFallbackImage(book);
          }}
        />
        {discountPercent > 0 && (
          <div className="discount-badge">-{discountPercent}%</div>
        )}
        {book.stockQuantity === 0 && (
          <div className="out-of-stock-overlay">Hết hàng</div>
        )}
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.bookTitle}</h3>
        <div className="book-price">
          {originalPrice && originalPrice > book.price ? (
            <span className="original-price">{formatPrice(originalPrice)}</span>
          ) : (
            <span className="original-price-placeholder">&nbsp;</span>
          )}
          <span className="current-price">{formatPrice(book.price)}</span>
        </div>
        <div className="card-footer-info">
          {hasReviews && (
            <>
              <div className="card-stars">
                {renderStars(averageRating)}
              </div>
              <span className="info-divider">|</span>
            </>
          )}
          <span className="sold-quantity">Đã bán {soldCount}</span>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
