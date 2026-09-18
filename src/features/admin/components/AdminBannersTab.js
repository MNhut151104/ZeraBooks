import React, { useState } from 'react';
import axios from 'axios';

export function AdminBannersTab({
  banners,
  loading,
  handleOpenBannerModal,
  handleDeleteBanner,
  setBanners
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const saveBannerOrders = async (newBanners) => {
    try {
      const bannerOrders = newBanners.map((b, idx) => ({ id: b._id, order: idx }));
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/banners/reorder',
        { bannerOrders },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error saving reordered banners:', err);
    }
  };

  const handleMoveBanner = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const updatedBanners = [...banners];
    const temp = updatedBanners[index];
    updatedBanners[index] = updatedBanners[targetIndex];
    updatedBanners[targetIndex] = temp;

    const reordered = updatedBanners.map((b, idx) => ({ ...b, order: idx }));
    setBanners(reordered);
    saveBannerOrders(reordered);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedBanners = [...banners];
    const [draggedItem] = updatedBanners.splice(draggedIndex, 1);
    updatedBanners.splice(targetIndex, 0, draggedItem);

    const reordered = updatedBanners.map((b, idx) => ({ ...b, order: idx }));
    setDraggedIndex(null);
    setBanners(reordered);
    saveBannerOrders(reordered);
  };

  const filteredBanners = banners.filter(banner => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const title = (banner.title || '').toLowerCase();
    const subtitle = (banner.subtitle || '').toLowerCase();
    const linkUrl = (banner.linkUrl || '').toLowerCase();
    return title.includes(term) || subtitle.includes(term) || linkUrl.includes(term);
  });

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Quản lý Banner ({filteredBanners.length}{searchTerm ? ` / ${banners.length}` : ''})</h2>
        
        <div className="admin-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm tiêu đề banner, đường dẫn link..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="admin-search-clear" onClick={() => setSearchTerm('')} title="Xóa tìm kiếm">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <button className="btn-primary" onClick={() => handleOpenBannerModal()}>
          <i className="fa-solid fa-plus"></i> Thêm Banner mới
        </button>
      </div>

      <div style={{
        background: '#F1F5F9',
        color: '#475569',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <i className="fa-solid fa-lightbulb" style={{ color: '#EAB308', fontSize: '15px' }}></i>
        <span><strong>Thứ tự hiển thị banner:</strong> Được sắp xếp trực tiếp theo thứ tự danh sách bên dưới. Bạn có thể bấm nút mũi tên <i className="fa-solid fa-arrow-up"></i> <i className="fa-solid fa-arrow-down"></i> hoặc kéo thả dòng để di chuyển vị trí.</span>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: '110px', textAlign: 'center' }}>Vị trí</th>
                <th>Hình ảnh</th>
                <th>Tiêu đề & Khuyến mãi</th>
                <th>Đường dẫn Link</th>
                <th>Hoạt động</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">
                    <i className="fa-solid fa-images"></i>
                    {searchTerm 
                      ? `Không tìm thấy banner nào phù hợp với từ khóa "${searchTerm}"`
                      : 'Chưa có banner nào'}
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner, index) => (
                  <tr 
                    key={banner._id} 
                    className={banner.isActive === false ? 'inactive' : ''}
                    draggable={!searchTerm}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{ cursor: !searchTerm ? 'grab' : 'default' }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {!searchTerm && (
                          <i className="fa-solid fa-grip-vertical" style={{ color: '#94A3B8', cursor: 'grab', marginRight: '4px' }} title="Kéo thả để sắp xếp"></i>
                        )}
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>
                          #{index + 1}
                        </span>
                        {!searchTerm && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <button
                              type="button"
                              onClick={() => handleMoveBanner(index, 'up')}
                              disabled={index === 0}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                color: index === 0 ? '#CBD5E1' : '#2563EB',
                                padding: 0,
                                fontSize: '12px'
                              }}
                              title="Lên trên"
                            >
                              <i className="fa-solid fa-chevron-up"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveBanner(index, 'down')}
                              disabled={index === filteredBanners.length - 1}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: index === filteredBanners.length - 1 ? 'not-allowed' : 'pointer',
                                color: index === filteredBanners.length - 1 ? '#CBD5E1' : '#2563EB',
                                padding: 0,
                                fontSize: '12px'
                              }}
                              title="Xuống dưới"
                            >
                              <i className="fa-solid fa-chevron-down"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="banner-preview-cell">
                        <img 
                          src={banner.imageUrl || '/images/banners/default.jpg'} 
                          alt={banner.title || 'Banner'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/120x60?text=Banner';
                          }}
                          style={{
                            width: '120px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0'
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '14px', color: '#1E293B' }}>{banner.title || '(Không có tiêu đề)'}</strong>
                        {banner.subtitle && (
                          <span style={{ fontSize: '12px', color: '#64748B' }}>{banner.subtitle}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {banner.linkUrl ? (
                        <span style={{ fontSize: '13px', color: '#2563EB', wordBreak: 'break-all' }}>
                          {banner.linkUrl}
                        </span>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>
                          (Không chuyển link)
                        </span>
                      )}
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={banner.isActive !== undefined ? banner.isActive : true}
                        onChange={async (e) => {
                          const newStatus = e.target.checked;
                          try {
                            const token = localStorage.getItem('token');
                            const response = await axios.put(
                              `http://localhost:5000/api/banners/${banner._id}`,
                              { isActive: newStatus },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            if (response.data.success) {
                              const updated = response.data.data?.banner;
                              setBanners(prevBanners => 
                                prevBanners.map(b => 
                                  b._id === banner._id 
                                    ? { ...b, ...(updated || {}), isActive: newStatus }
                                    : b
                                )
                              );
                            }
                          } catch (error) {
                            console.error('Error updating banner status:', error);
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
                          onClick={() => handleOpenBannerModal(banner)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          title="Xóa"
                          onClick={() => handleDeleteBanner(banner._id)}
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
