import React from 'react';

export function AdminBookModal({
  showBookModal,
  handleCloseBookModal,
  handleSubmitBook,
  editingBook,
  bookFormData,
  handleBookFormChange,
  categories,
  handleImageChange,
  imageFile
}) {
  if (!showBookModal) return null;

  const selectedCatObj = categories.find(c => String(c._id) === String(bookFormData.category));
  const catName = selectedCatObj ? selectedCatObj.categoryName : '';

  const getCategoryType = (name) => {
    if (!name) return 'NONE';
    const lower = name.toLowerCase();
    if (lower.includes('sách')) return 'BOOK';
    if (lower.includes('bút')) return 'PEN';
    if (lower.includes('sổ')) return 'NOTEBOOK';
    if (lower.includes('họa cụ')) return 'ART';
    if (lower.includes('thủ công')) return 'CRAFT';
    if (lower.includes('gói quà')) return 'GIFT';
    if (lower.includes('nhạc cụ')) return 'MUSIC';
    if (lower.includes('dụng cụ học sinh') || lower.includes('văn phòng')) return 'OFFICE';
    if (lower.includes('quà lưu niệm')) return 'SOUVENIR';
    return 'GENERAL';
  };

  const catType = getCategoryType(catName);

  return (
    <div className="modal-overlay" onClick={handleCloseBookModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingBook ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button className="modal-close" onClick={handleCloseBookModal}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmitBook} className="book-form">
          {/* STEP 1: CHỌN DANH MỤC VÀ TÊN SẢN PHẨM */}
          <div className="form-section-title">
            <i className="fa-solid fa-layer-group"></i> 1. Chọn Danh mục & Thông tin chính
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Danh mục sản phẩm <span className="required">*</span></label>
              <select
                name="category"
                value={bookFormData.category}
                onChange={handleBookFormChange}
                required
              >
                <option value="">-- Chọn danh mục sản phẩm trước --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tên sản phẩm <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                value={bookFormData.title}
                onChange={handleBookFormChange}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
          </div>

          {catType === 'NONE' ? (
            <div className="category-select-notice">
              <i className="fa-solid fa-circle-info"></i>
              <span>Vui lòng <strong>Chọn danh mục sản phẩm</strong> ở trên để mở khóa các trường thông tin phù hợp cho sản phẩm này.</span>
            </div>
          ) : (
            <>
              {/* PRICE & STOCK SECTION */}
              <div className="form-row three-cols">
                <div className="form-group">
                  <label>Giá bán <span className="required">*</span></label>
                  <input
                    type="number"
                    name="price"
                    value={bookFormData.price}
                    onChange={handleBookFormChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Giá gốc (nếu giảm giá)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={bookFormData.originalPrice}
                    onChange={handleBookFormChange}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Tồn kho <span className="required">*</span></label>
                  <input
                    type="number"
                    name="stock"
                    value={bookFormData.stock}
                    onChange={handleBookFormChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* DYNAMIC SPECIFICATIONS SECTION */}
              <div className="form-section-title">
                <i className="fa-solid fa-list-check"></i> 2. Thông số chi tiết 
                <span className="category-badge-tag">{catName}</span>
              </div>

              {/* DYNAMIC FIELDS PER CATEGORY TYPE */}
              {catType === 'BOOK' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tác giả</label>
                      <input
                        type="text"
                        name="author"
                        value={bookFormData.author}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nguyễn Nhật Ánh"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nhà xuất bản</label>
                      <input
                        type="text"
                        name="publisher"
                        value={bookFormData.publisher}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: NXB Trẻ"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thể loại</label>
                      <select
                        name="genre"
                        value={bookFormData.genre}
                        onChange={handleBookFormChange}
                      >
                        <option value="">-- Chọn thể loại --</option>
                        <option value="Văn học">Văn học</option>
                        <option value="Kinh tế">Kinh tế</option>
                        <option value="Kỹ năng sống">Kỹ năng sống</option>
                        <option value="Thiếu nhi">Thiếu nhi</option>
                        <option value="Khoa học">Khoa học</option>
                        <option value="Tâm lý">Tâm lý</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Loại bìa</label>
                      <select
                        name="coverType"
                        value={bookFormData.coverType}
                        onChange={handleBookFormChange}
                      >
                        <option value="">-- Chọn loại bìa --</option>
                        <option value="Bìa mềm">Bìa mềm</option>
                        <option value="Bìa cứng">Bìa cứng</option>
                        <option value="Hộp">Hộp</option>
                        <option value="Bộ">Bộ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row three-cols">
                    <div className="form-group">
                      <label>Năm xuất bản</label>
                      <input
                        type="number"
                        name="publishedYear"
                        value={bookFormData.publishedYear}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 2024"
                      />
                    </div>
                    <div className="form-group">
                      <label>Số trang</label>
                      <input
                        type="number"
                        name="pageCount"
                        value={bookFormData.pageCount}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 250"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ngôn ngữ</label>
                      <input
                        type="text"
                        name="language"
                        value={bookFormData.language}
                        onChange={handleBookFormChange}
                        placeholder="Tiếng Việt"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Mã ISBN (nếu có)</label>
                      <input
                        type="text"
                        name="isbn"
                        value={bookFormData.isbn}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 978-604-1-23456-7"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'PEN' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Thiên Long, Pentel, Pilot..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nhật Bản, Đức, Việt Nam..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Màu mực / Màu sắc</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Xanh, Đỏ, Đen, Tím..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Kích thước ngòi</label>
                      <input
                        type="text"
                        name="tipSize"
                        value={bookFormData.tipSize}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 0.5mm, 0.7mm"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu thân bút</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nhựa cao cấp, Kim loại..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Trọng lượng (g)</label>
                      <input
                        type="number"
                        name="weight"
                        value={bookFormData.weight}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 20"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'NOTEBOOK' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Klong, Hồng Hà, Campus..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Việt Nam, Nhật Bản..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Khổ giấy / Kích thước</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: A4, A5, B5, 20x15cm..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Số trang</label>
                      <input
                        type="number"
                        name="pageCount"
                        value={bookFormData.pageCount}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 100 trang, 200 trang"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Định lượng giấy</label>
                      <input
                        type="text"
                        name="paperWeight"
                        value={bookFormData.paperWeight}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 70gsm, 80gsm, 100gsm"
                      />
                    </div>
                    <div className="form-group">
                      <label>Dòng kẻ</label>
                      <input
                        type="text"
                        name="rulingType"
                        value={bookFormData.rulingType}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Kẻ ngang, Ô vuông, Dot grid, Trơn"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Chất liệu bìa</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Bìa da, Bìa cứng, Bìa nhựa..."
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'OFFICE' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Deli, Thiên Long, Plus..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Việt Nam, Trung Quốc, Đức..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nhựa, Kim loại, Cao su..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Màu sắc</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Đen, Trắng, Xám..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kích thước</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 15x10 cm"
                      />
                    </div>
                    <div className="form-group">
                      <label>Trọng lượng (g)</label>
                      <input
                        type="number"
                        name="weight"
                        value={bookFormData.weight}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 150"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'ART' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Faber-Castell, Marvy, Holbein..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Đức, Nhật Bản..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Màu sắc / Số màu</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Bộ 12 màu, Bộ 24 màu, Màu nước..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Sáp dầu, Màu chì, Giấy vẽ 300gsm..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kích thước</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Khổ A3, A4..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Cảnh báo an toàn</label>
                      <input
                        type="text"
                        name="safetyWarning"
                        value={bookFormData.safetyWarning}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Khuyên dùng cho trẻ trên 3 tuổi, Không độc hại"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'CRAFT' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Sakura, M&G..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nhật Bản, Trung Quốc, Việt Nam..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Đất sét tự khô, Keo dán, Gỗ, Nhựa..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Màu sắc</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nhiều màu, Trắng..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kích thước</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 10x10 cm, Dây dài 5m..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Cảnh báo an toàn</label>
                      <input
                        type="text"
                        name="safetyWarning"
                        value={bookFormData.safetyWarning}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Dùng dưới sự giám sát của người lớn"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'GIFT' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Zera Gift..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Việt Nam, Hàn Quốc..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Giấy bọc quà, Hộp bìa cứng, Ruy băng vải..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Màu sắc</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Đỏ may mắn, Vàng ánh kim, Pastel..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Kích thước (Dài x Rộng x Cao)</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 50x70cm, 20x20x10cm..."
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'MUSIC' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Yamaha, Suzuki, Alice..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Nhật Bản, Việt Nam..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Gỗ Rosewood, Đồng, Nhựa ABS..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Kích thước</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Size 21 inch, Size 23 inch..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Trọng lượng (g)</label>
                      <input
                        type="number"
                        name="weight"
                        value={bookFormData.weight}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 500"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'SOUVENIR' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Zera Souvenirs..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Việt Nam, Nhật Bản..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Gốm sứ, Thủy tinh, Gỗ tự nhiên..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Màu sắc</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: Đa sắc, Màu gỗ..."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kích thước</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={bookFormData.dimensions}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 10x15 cm"
                      />
                    </div>
                    <div className="form-group">
                      <label>Trọng lượng (g)</label>
                      <input
                        type="number"
                        name="weight"
                        value={bookFormData.weight}
                        onChange={handleBookFormChange}
                        placeholder="Ví dụ: 300"
                      />
                    </div>
                  </div>
                </>
              )}

              {catType === 'GENERAL' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input
                        type="text"
                        name="brand"
                        value={bookFormData.brand}
                        onChange={handleBookFormChange}
                        placeholder="Nhập thương hiệu"
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        name="origin"
                        value={bookFormData.origin}
                        onChange={handleBookFormChange}
                        placeholder="Nhập xuất xứ"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chất liệu</label>
                      <input
                        type="text"
                        name="material"
                        value={bookFormData.material}
                        onChange={handleBookFormChange}
                        placeholder="Nhập chất liệu"
                      />
                    </div>
                    <div className="form-group">
                      <label>Màu sắc</label>
                      <input
                        type="text"
                        name="color"
                        value={bookFormData.color}
                        onChange={handleBookFormChange}
                        placeholder="Nhập màu sắc"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* SECTION 3: HÌNH ẢNH VÀ MÔ TẢ */}
              <div className="form-section-title">
                <i className="fa-solid fa-image"></i> 3. Hình ảnh & Mô tả
              </div>

              <div className="form-row">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Upload ảnh sản phẩm</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFile && (
                    <small style={{ color: '#16A34A', marginTop: '5px', display: 'block', fontWeight: 600 }}>
                      <i className="fa-solid fa-check"></i> Đã chọn: {imageFile.name}
                    </small>
                  )}
                  {editingBook?.imageUrl && !imageFile && (
                    <small style={{ color: '#64748B', marginTop: '5px', display: 'block' }}>
                      Ảnh hiện tại: {editingBook.imageUrl}
                    </small>
                  )}
                  <small style={{ color: '#64748B', marginTop: '5px', display: 'block' }}>
                    Định dạng: JPG, PNG, GIF, WEBP. Kích thước tối đa: 500KB. Khuyến nghị: 600x800px (3:4)
                  </small>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Mô tả sản phẩm</label>
                <textarea
                  name="description"
                  value={bookFormData.description}
                  onChange={handleBookFormChange}
                  rows="4"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                ></textarea>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={bookFormData.isFeatured}
                    onChange={handleBookFormChange}
                  />
                  <span>Đánh dấu là Sản phẩm nổi bật</span>
                </label>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseBookModal}>
              Hủy
            </button>
            {catType !== 'NONE' && (
              <button type="submit" className="btn-primary">
                <i className="fa-solid fa-save"></i> {editingBook ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
