import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { booksAPI } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import React from 'react';

export function useBookDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const [bookResponse, reviewsResponse] = await Promise.all([
        booksAPI.getBookById(id),
        booksAPI.getBookReviews(id).catch(() => ({ data: { data: { reviews: [], pagination: { total: 0 } } } }))
      ]);

      const bookData = bookResponse.data?.data?.book;
      setBook(bookData);
      const revData = reviewsResponse.data?.data;
      const revList = revData?.reviews || [];
      const totalCount = revData?.pagination?.total !== undefined ? revData.pagination.total : revList.length;
      setReviews(revList);
      setTotalReviews(totalCount);

      // Fetch related books if category exists
      if (bookData?.category?._id) {
        const relatedResponse = await booksAPI.getRelatedBooks(id).catch(() =>
          booksAPI.getBooks({ category: bookData.category._id, limit: 5 })
        );
        setRelatedBooks(relatedResponse.data?.data?.books || []);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

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

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= book.stockQuantity) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (book) {
      const res = addToCart(book, quantity);
      if (res && res.message) {
        alert(res.message);
      }
    }
  };

  return {
    book,
    quantity,
    activeTab,
    setActiveTab,
    reviews,
    totalReviews,
    relatedBooks,
    loading,
    handleQuantityChange,
    handleAddToCart,
    formatPrice,
    renderStars
  };
}
