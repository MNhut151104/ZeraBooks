import React from 'react';

export function AdminBannerModal({
  showBannerModal,
  handleCloseBannerModal,
  handleSubmitBanner,
  editingBanner,
  bannerFormData,
  handleBannerFormChange,
  handleBannerImageChange,
  bannerImageFile
}) {
  if (!showBannerModal) return null;

  return (
    <div className="modal-overlay" onClick={handleCloseBannerModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingBanner ? 'Sửa Banner' : 'Thêm Banner mới'}</h2>
          <button className="modal-close" onClick={handleCloseBannerModal}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmitBanner} className="book-form">
          <div className="form-section-title">
            <i className="fa-solid fa-image"></i> Thông tin Banner
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Tiêu đề Banner chính</label>
              <input
                type="text"
                name="title"
                value={bannerFormData.title}
                onChange={handleBannerFormChange}
                placeholder="Ví dụ: Giảm giá mùa hè lên đến 50%"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Mô tả ngắn / Khuyến mãi (Subtitle)</label>
              <input
                type="text"
                name="subtitle"
                value={bannerFormData.subtitle}
                onChange={handleBannerFormChange}
                placeholder="Ví dụ: Áp dụng cho tất cả sản phẩm Sách & Văn phòng phẩm"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Đường dẫn khi bấm (Link URL)</label>
              <input
                type="text"
                name="linkUrl"
                value={bannerFormData.linkUrl}
                onChange={handleBannerFormChange}
                placeholder="Ví dụ: /books (Để trống nếu không muốn chèn link)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Upload hình ảnh Banner <span className="required">*</span></label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
              />
              {bannerImageFile && (
                <small style={{ color: '#16A34A', marginTop: '5px', display: 'block', fontWeight: 600 }}>
                  <i className="fa-solid fa-check"></i> Đã chọn: {bannerImageFile.name}
                </small>
              )}
              {editingBanner?.imageUrl && !bannerImageFile && (
                <div style={{ marginTop: '10px' }}>
                  <small style={{ color: '#64748B', display: 'block', marginBottom: '5px' }}>
                    Ảnh banner hiện tại:
                  </small>
                  <img 
                    src={editingBanner.imageUrl} 
                    alt="Current Banner" 
                    style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              )}
              <small style={{ color: '#0284C7', marginTop: '6px', display: 'block', fontSize: '12.5px', background: '#F0F9FF', padding: '6px 10px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>
                <i className="fa-solid fa-circle-info" style={{ marginRight: '6px' }}></i>
                <strong>Tỉ lệ ảnh hoàn hảo:</strong> Tỉ lệ ngang <strong>3:1</strong> hoặc <strong>16:9</strong> (Kích thước đề xuất: <strong>1200x400px</strong> hoặc <strong>1920x600px</strong> để hiển thị sắc nét và không bị ẩn chi tiết).
              </small>
            </div>
          </div>

          <div className="form-group checkbox-group" style={{ marginTop: '15px' }}>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={bannerFormData.isActive}
                onChange={handleBannerFormChange}
              />
              <span>Hiển thị trên Trang chủ Website</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseBannerModal}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              <i className="fa-solid fa-save"></i> {editingBanner ? 'Cập nhật Banner' : 'Lưu Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
