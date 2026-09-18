import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookDetail } from '../features/books/hooks/useBookDetail';
import { BookInfoUI } from '../features/books/components/BookInfoUI';
import './BookDetail.css';

function BookDetail() {
  const { t } = useTranslation();
  const bookDetailState = useBookDetail();
  const { loading, book } = bookDetailState;

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>{t('bookDetail.loading')}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <h2>{t('bookDetail.notFound')}</h2>
        <Link to="/books" className="back-link">{t('bookDetail.backToList')}</Link>
      </div>
    );
  }

  return <BookInfoUI {...bookDetailState} />;
}

export default BookDetail;