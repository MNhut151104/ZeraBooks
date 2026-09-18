import React, { useState } from 'react';
import { getDefaultProductImage, getCategoryFallbackImage } from '../utils/imageHelper';
import './ReviewModal.css';

function ReviewModal({ isOpen, onClose, book, orderId, onSubmitSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitSuccess({
        bookId: book._id,
        rating,
        comment: comment.trim()
      });
      
      // Reset form
      setRating(5);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'review-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="review-modal-overlay" onClick={handleOverlayClick}>
      <div className="review-modal">
        <div className="review-modal-header">
          <h2>Đánh giá sản phẩm</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="review-modal-body">
          <div className="book-info">
            <img 
              src={getDefaultProductImage(book)} 
              alt={book.bookTitle || book.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCategoryFallbackImage(book);
              }}
            />
            <div className="book-details">
              <h3>{book.bookTitle}</h3>
              <p className="book-author">
                <i className="fas fa-user"></i>
                {book.author || book.authorName || 'N/A'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <label>Đánh giá của bạn</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
              <div className="rating-text">
                {rating === 1 && 'Rất tệ'}
                {rating === 2 && 'Tệ'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Tốt'}
                {rating === 5 && 'Rất tốt'}
              </div>
            </div>

            <div className="comment-section">
              <label htmlFor="comment">Nhận xét của bạn</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                rows="5"
                maxLength="1000"
              />
              <div className="char-count">{comment.length}/1000 ký tự</div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Gửi đánh giá
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

export default ReviewModal;
