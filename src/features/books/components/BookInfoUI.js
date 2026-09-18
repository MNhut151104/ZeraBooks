import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookCard from '../../../components/BookCard';
import { getDefaultProductImage, getCategoryFallbackImage } from '../../../utils/imageHelper';

export function BookInfoUI({
  book,
  quantity,
  activeTab,
  setActiveTab,
  reviews,
  totalReviews,
  relatedBooks,
  handleQuantityChange,
  handleAddToCart,
  formatPrice,
  renderStars
}) {
  const { t } = useTranslation();

  if (!book) return null;

  const actualReviewCount = totalReviews !== undefined ? totalReviews : (reviews ? reviews.length : 0);
  const calculatedRating = (reviews && reviews.length > 0)
    ? Math.round((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) * 10) / 10
    : (book.averageRating || 0);
  const effectiveRating = actualReviewCount === 0 ? 0 : calculatedRating;

  const hasDiscount = (book.discountPercent > 0) || (book.originalPrice && book.originalPrice > book.price);
  const discountPercentVal = book.discountPercent > 0
    ? book.discountPercent
    : (book.originalPrice && book.originalPrice > book.price
        ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
        : 0);
  const originalPriceVal = book.originalPrice || (discountPercentVal > 0 ? Math.round(book.price / (1 - discountPercentVal / 100)) : null);

  const getDynamicSpecs = (item) => {
    if (!item) return [];
    const specs = [];

    const catName = typeof item.category === 'object' ? item.category?.categoryName : item.category;
    const isBook = item.productType === 'Book' || (catName && (String(catName).toLowerCase().includes('sách') || String(catName).toLowerCase().includes('book')));

    // Danh mục
    if (catName) {
      specs.push({ label: 'Danh mục', value: catName });
    }

    // Tác giả & Nhà xuất bản (chỉ dành cho Sách)
    if (isBook) {
      const authorVal = typeof item.author === 'object' ? item.author?.authorName : item.author;
      if (authorVal && String(authorVal).trim()) {
        specs.push({ label: 'Tác giả', value: String(authorVal).trim() });
      }

      const publisherVal = typeof item.publisher === 'object' ? item.publisher?.publisherName : item.publisher;
      if (publisherVal && String(publisherVal).trim()) {
        specs.push({ label: 'Nhà xuất bản', value: String(publisherVal).trim() });
      }
    }

    // Thương hiệu
    if (item.brand && String(item.brand).trim()) {
      specs.push({ label: 'Thương hiệu', value: String(item.brand).trim() });
    }

    // Xuất xứ
    if (item.origin && String(item.origin).trim()) {
      specs.push({ label: 'Xuất xứ', value: String(item.origin).trim() });
    }

    // Chất liệu
    const materialVal = item.material || item.coverMaterial;
    if (materialVal && String(materialVal).trim()) {
      specs.push({ label: 'Chất liệu', value: String(materialVal).trim() });
    }

    // Màu sắc
    const colorVal = item.color || item.inkColor;
    if (colorVal && String(colorVal).trim()) {
      specs.push({ label: 'Màu sắc', value: String(colorVal).trim() });
    }

    // Kích thước
    const dimVal = item.dimensions || item.paperSize;
    if (dimVal && String(dimVal).trim()) {
      specs.push({ label: 'Kích thước', value: String(dimVal).trim() });
    }

    // Kích thước ngòi
    if (item.tipSize && String(item.tipSize).trim()) {
      specs.push({ label: 'Kích thước ngòi', value: String(item.tipSize).trim() });
    }

    // Định lượng giấy
    if (item.paperWeight && String(item.paperWeight).trim()) {
      specs.push({ label: 'Định lượng giấy', value: String(item.paperWeight).trim() });
    }

    // Dòng kẻ
    if (item.rulingType && String(item.rulingType).trim()) {
      specs.push({ label: 'Dòng kẻ', value: String(item.rulingType).trim() });
    }

    // Thể loại
    if (item.genre && String(item.genre).trim()) {
      specs.push({ label: 'Thể loại', value: String(item.genre).trim() });
    }

    // Loại bìa
    if (item.coverType && String(item.coverType).trim()) {
      specs.push({ label: 'Loại bìa', value: String(item.coverType).trim() });
    }

    // Số trang
    if (item.pageCount) {
      specs.push({ label: 'Số trang', value: `${item.pageCount} trang` });
    }

    // Năm xuất bản
    const yearVal = item.publishYear || item.publishedYear || item.publicationYear;
    if (yearVal) {
      specs.push({ label: 'Năm xuất bản', value: yearVal });
    }

    // Ngôn ngữ
    const langVal = item.bookLanguage || item.language;
    if (langVal && String(langVal).trim()) {
      specs.push({ label: 'Ngôn ngữ', value: String(langVal).trim() });
    }

    // ISBN
    if (item.isbn && String(item.isbn).trim()) {
      specs.push({ label: 'ISBN', value: String(item.isbn).trim() });
    }

    // Trọng lượng
    if (item.weight) {
      const weightDisplay = typeof item.weight === 'number' ? `${item.weight}g` : item.weight;
      specs.push({ label: 'Trọng lượng', value: weightDisplay });
    }

    return specs;
  };

  const dynamicSpecs = getDynamicSpecs(book);
  const catNameMain = typeof book.category === 'object' ? book.category?.categoryName : book.category;
  const isBookMain = book.productType === 'Book' || (catNameMain && (String(catNameMain).toLowerCase().includes('sách') || String(catNameMain).toLowerCase().includes('book')));
  
  const authorDisplay = isBookMain ? (typeof book.author === 'object' ? book.author?.authorName : book.author) : '';
  const publisherDisplay = isBookMain ? (typeof book.publisher === 'object' ? book.publisher?.publisherName : book.publisher) : '';
  const publishYearDisplay = book.publicationYear || book.publishedYear || book.publishYear;
  const languageDisplay = book.language || book.bookLanguage;

  return (
    <div className="book-detail-page">
      {/* Breadcrumb */}
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          {book.category && (
            <>
              <i className="fas fa-chevron-right"></i>
              <Link to={`/books?category=${book.category._id || book.category}`}>{book.category.categoryName || 'Danh mục'}</Link>
            </>
          )}
          <i className="fas fa-chevron-right"></i>
          <span>{book.bookTitle || book.name}</span>
        </div>
      </div>

      {/* Book Details */}
      <div className="container">
        <div className="book-detail-content">
          {/* Left: Images */}
          <div className="book-images">
            <div className="main-image">
              {hasDiscount && (
                <div className="image-discount-badge">
                  <span className="discount-percent">-{discountPercentVal}%</span>
                  <span className="discount-label">GIẢM</span>
                </div>
              )}
              <img
                src={getDefaultProductImage(book)}
                alt={book.bookTitle || book.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getCategoryFallbackImage(book);
                }}
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="book-details">
            <h1 className="book-title">{book.bookTitle || book.name}</h1>

            <div className="book-rating-section">
              <div className="stars-large">{renderStars(effectiveRating)}</div>
              <span className="rating-score">{effectiveRating === 0 ? '0' : effectiveRating.toFixed(1)}</span>
              <span className="review-count">({actualReviewCount} {t('bookDetail.rating')})</span>
            </div>

            <div className="book-price-section">
              <div className="price-info">
                <span className="current-price">{formatPrice(book.price)}</span>
                {hasDiscount && originalPriceVal && (
                  <>
                    <span className="original-price">{formatPrice(originalPriceVal)}</span>
                    <span className="discount-badge">-{discountPercentVal}%</span>
                  </>
                )}
              </div>
            </div>

            {(authorDisplay || publisherDisplay || book.brand || book.origin || book.isbn || publishYearDisplay || languageDisplay) && (
              <div className="book-info-grid">
                {authorDisplay && (
                  <div className="info-item">
                    <i className="fas fa-user"></i>
                    <span><strong>Tác giả:</strong> {authorDisplay}</span>
                  </div>
                )}
                {publisherDisplay && (
                  <div className="info-item">
                    <i className="fas fa-building"></i>
                    <span><strong>NXB:</strong> {publisherDisplay}</span>
                  </div>
                )}
                {book.brand && (
                  <div className="info-item">
                    <i className="fas fa-tag"></i>
                    <span><strong>Thương hiệu:</strong> {book.brand}</span>
                  </div>
                )}
                {book.origin && (
                  <div className="info-item">
                    <i className="fas fa-globe"></i>
                    <span><strong>Xuất xứ:</strong> {book.origin}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="info-item">
                    <i className="fas fa-barcode"></i>
                    <span><strong>ISBN:</strong> {book.isbn}</span>
                  </div>
                )}
                {publishYearDisplay && (
                  <div className="info-item">
                    <i className="fas fa-calendar"></i>
                    <span><strong>Năm XB:</strong> {publishYearDisplay}</span>
                  </div>
                )}
                {languageDisplay && (
                  <div className="info-item">
                    <i className="fas fa-language"></i>
                    <span><strong>Ngôn ngữ:</strong> {languageDisplay}</span>
                  </div>
                )}
              </div>
            )}

            <div className="quantity-section">
              <label>{t('cart.quantity')}:</label>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <i className="fas fa-minus"></i>
                </button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= book.stockQuantity}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <span className="stock-info">
                {book.stockQuantity > 0 ? (
                  <><i className="fas fa-check-circle"></i> {t('bookDetail.stock', { defaultValue: 'Còn sản phẩm' })} ({book.stockQuantity})</>
                ) : (
                  <><i className="fas fa-times-circle"></i> {t('bookDetail.outOfStock')}</>
                )}
              </span>
            </div>

            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={book.stockQuantity === 0}
              >
                <i className="fas fa-shopping-cart"></i>
                {t('bookDetail.addToCart')}
              </button>
              <button className="buy-now-btn">
                <i className="fas fa-bolt"></i>
                {t('bookDetail.buyNow')}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="book-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              {t('bookDetail.specifications')}
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              {t('bookDetail.reviews')} ({reviews ? reviews.length : (book.numReviews || book.reviewCount || 0)})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Mô tả sản phẩm</h3>
                <div className="description-text">
                  {book.description ? (
                    book.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>Chưa có mô tả chi tiết</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-panel">
                <h3>Thông tin chi tiết</h3>
                <table className="specifications-table">
                  <tbody>
                    {dynamicSpecs.length > 0 ? (
                      dynamicSpecs.map((spec, index) => (
                        <tr key={index}>
                          <td className="spec-label">{spec.label}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="spec-empty">Không có thông tin chi tiết</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Đánh giá từ khách hàng</h3>
                <div className="reviews-list">
                  {reviews.length === 0 ? (
                    <p>Chưa có đánh giá nào cho sản phẩm này</p>
                  ) : (
                    reviews.map(review => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.customer?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="reviewer-name">{review.customer?.fullName || 'Khách hàng'}</div>
                              <div className="review-date">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          </div>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="review-comment">{review.comment}</div>
                        {review.helpful !== undefined && (
                          <div className="review-helpful">
                            <button>
                              <i className="far fa-thumbs-up"></i> Hữu ích ({review.helpful})
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Books */}
      <div className="container">
        {relatedBooks.length > 0 && (
          <div className="related-books-section">
            <h2 className="section-title">Sản phẩm tương tự</h2>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <BookCard key={relatedBook._id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
