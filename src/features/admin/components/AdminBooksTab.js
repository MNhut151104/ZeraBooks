import React, { useState } from 'react';
import axios from 'axios';
import { getDefaultProductImage, getCategoryFallbackImage } from '../../../utils/imageHelper';

export function AdminBooksTab({
  books,
  loading,
  formatPrice,
  handleOpenBookModal,
  handleDeleteBook,
  setBooks
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const title = (book.bookTitle || book.title || book.name || '').toLowerCase();
    const category = (book.category?.categoryName || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    const publisher = (book.publisher || '').toLowerCase();
    return title.includes(term) || category.includes(term) || author.includes(term) || publisher.includes(term);
  });

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Quản lý sản phẩm ({filteredBooks.length}{searchTerm ? ` / ${books.length}` : ''})</h2>
        
        <div className="admin-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm tên sản phẩm, danh mục, tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="admin-search-clear" onClick={() => setSearchTerm('')} title="Xóa tìm kiếm">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <button className="btn-primary" onClick={() => handleOpenBookModal()}>
          <i className="fa-solid fa-plus"></i> Thêm sản phẩm mới
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá bán</th>
                <th>Giá gốc</th>
                <th>Tồn kho</th>
                <th>Danh mục</th>
                <th>Hoạt động</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-results">
                    <i className="fa-solid fa-box-open"></i>
                    {searchTerm 
                      ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchTerm}"`
                      : 'Chưa có sản phẩm nào'}
                  </td>
                </tr>
              ) : (
                filteredBooks.map(book => (
                  <tr key={book._id} className={book.isActive === false ? 'inactive' : ''}>
                    <td>
                      <div className="book-cell">
                        <img 
                          src={getDefaultProductImage(book)} 
                          alt={book.bookTitle || book.title || book.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getCategoryFallbackImage(book);
                          }}
                        />
                        <span>{book.bookTitle || book.title}</span>
                      </div>
                    </td>
                    <td>{formatPrice(book.price)}</td>
                    <td>{book.originalPrice ? formatPrice(book.originalPrice) : '-'}</td>
                    <td>
                      <span className={`stock-badge ${(book.stockQuantity || book.stock) < 10 ? 'low' : 'good'}`}>
                        {book.stockQuantity || book.stock || 0}
                      </span>
                    </td>
                    <td>{book.category?.categoryName || '-'}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={book.isActive !== undefined ? book.isActive : true}
                        onChange={async (e) => {
                          const newStatus = e.target.checked;
                          try {
                            const token = localStorage.getItem('token');
                            const response = await axios.put(
                              `http://localhost:5000/api/books/${book._id}`,
                              { isActive: newStatus },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            if (response.data.success) {
                              const updatedBook = response.data.data?.book;
                              setBooks(prevBooks => 
                                prevBooks.map(b => 
                                  b._id === book._id 
                                    ? { ...b, ...(updatedBook || {}), isActive: newStatus, category: updatedBook?.category || b.category }
                                    : b
                                )
                              );
                            }
                          } catch (error) {
                            console.error('Error updating book status:', error);
                            alert('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
                          }
                        }}
                        className="active-checkbox"
                      />
                    </td>
                    <td>
                      <div className="action-btns">
                        <button 
                          className="btn-edit" 
                          title="Sửa"
                          onClick={() => handleOpenBookModal(book)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          title="Xóa"
                          onClick={() => handleDeleteBook(book._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
