import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import { AdminOverviewTab } from '../features/admin/components/AdminOverviewTab';
import { AdminBooksTab } from '../features/admin/components/AdminBooksTab';
import { AdminOrdersTab } from '../features/admin/components/AdminOrdersTab';
import { AdminCustomersTab } from '../features/admin/components/AdminCustomersTab';
import { AdminBannersTab } from '../features/admin/components/AdminBannersTab';
import { AdminBookModal } from '../features/admin/components/AdminBookModal';
import { AdminBannerModal } from '../features/admin/components/AdminBannerModal';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const dashboardState = useAdminDashboard();

  const {
    user,
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    stats,
    books,
    orders,
    customers,
    categories,
    reviews,
    banners,
    setBanners,
    loading,
    showBookModal,
    bookFormData,
    editingBook,
    imageFile,
    showBannerModal,
    editingBanner,
    bannerImageFile,
    bannerFormData,
    handleLogout,
    toggleSidebar,
    handleDeleteBook,
    handleOpenBookModal,
    handleCloseBookModal,
    handleBookFormChange,
    handleImageChange,
    handleSubmitBook,
    handleDeleteReview,
    handleOpenBannerModal,
    handleCloseBannerModal,
    handleBannerFormChange,
    handleBannerImageChange,
    handleSubmitBanner,
    handleDeleteBanner,
    formatPrice,
    formatDate,
    setBooks
  } = dashboardState;

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-logo">
          {!sidebarCollapsed && (
            <div className="logo-text">
              <h2>Zera Books</h2>
              <span>Admin Panel</span>
            </div>
          )}
          <button className="sidebar-toggle" onClick={toggleSidebar} title={sidebarCollapsed ? "Mở rộng" : "Thu gọn"}>
            <i className={`fa-solid ${sidebarCollapsed ? 'fa-bars' : 'fa-xmark'}`}></i>
          </button>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div className="admin-info">
            <strong>{user.fullName}</strong>
            <span>{user.role || 'Admin'}</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <i className="fa-solid fa-boxes-stacked"></i>
            <span>Quản lý sản phẩm</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-shopping-cart"></i>
            <span>Đơn hàng</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <i className="fa-solid fa-users"></i>
            <span>Khách hàng</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="fa-solid fa-star"></i>
            <span>Đánh giá</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            <i className="fa-solid fa-images"></i>
            <span>Quản lý Banner</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/')} title="Về trang chủ cửa hàng">
            <i className="fa-solid fa-home"></i>
            <span>Trang chủ</span>
          </div>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="btn-icon">
              <i className="fa-solid fa-bell"></i>
              <span className="badge">5</span>
            </button>
            <button className="btn-icon">
              <i className="fa-solid fa-envelope"></i>
              <span className="badge">12</span>
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon orders">
                <i className="fa-solid fa-shopping-cart"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.totalOrders}</h3>
                <p>Tổng đơn hàng</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon customers">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.totalCustomers}</h3>
                <p>Khách hàng</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon books">
                <i className="fa-solid fa-box"></i>
              </div>
              <div className="stat-details">
                <h3>{stats.totalBooks}</h3>
                <p>Sản phẩm</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue">
                <i className="fa-solid fa-dollar-sign"></i>
              </div>
              <div className="stat-details">
                <h3>{(stats.totalRevenue / 1000000).toFixed(1)}M</h3>
                <p>Doanh thu (VNĐ)</p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          {/* DASHBOARD OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <AdminOverviewTab
              setActiveTab={setActiveTab}
              handleOpenBookModal={handleOpenBookModal}
            />
          )}

          {/* BOOKS TAB */}
          {activeTab === 'books' && (
            <AdminBooksTab
              books={books}
              loading={loading}
              formatPrice={formatPrice}
              handleOpenBookModal={handleOpenBookModal}
              handleDeleteBook={handleDeleteBook}
              setBooks={setBooks}
            />
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              loading={loading}
              formatPrice={formatPrice}
              formatDate={formatDate}
              navigate={navigate}
            />
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <AdminCustomersTab
              customers={customers}
              loading={loading}
            />
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Quản lý đánh giá ({reviews.length})</h2>
              </div>

              {loading ? (
                <div className="loading">Đang tải...</div>
              ) : (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="review-user">
                          <strong>{review.customer?.fullName || 'Khách hàng'}</strong>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fa-solid fa-star ${i < review.rating ? 'active' : ''}`}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="review-book">Sản phẩm: <strong>{review.book?.bookTitle || review.book?.name || 'N/A'}</strong></p>
                      <p className="review-comment">{review.comment}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span className="review-date">{formatDate(review.reviewDate)}</span>
                        <button 
                          className="btn-delete" 
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <i className="fa-solid fa-trash"></i> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* BANNERS TAB */}
          {activeTab === 'banners' && (
            <AdminBannersTab
              banners={banners}
              loading={loading}
              handleOpenBannerModal={handleOpenBannerModal}
              handleDeleteBanner={handleDeleteBanner}
              setBanners={setBanners}
            />
          )}
        </div>
      </div>

      {/* BOOK MODAL */}
      <AdminBookModal
        showBookModal={showBookModal}
        handleCloseBookModal={handleCloseBookModal}
        handleSubmitBook={handleSubmitBook}
        editingBook={editingBook}
        bookFormData={bookFormData}
        handleBookFormChange={handleBookFormChange}
        categories={categories}
        handleImageChange={handleImageChange}
        imageFile={imageFile}
      />

      {/* BANNER MODAL */}
      <AdminBannerModal
        showBannerModal={showBannerModal}
        handleCloseBannerModal={handleCloseBannerModal}
        handleSubmitBanner={handleSubmitBanner}
        editingBanner={editingBanner}
        bannerFormData={bannerFormData}
        handleBannerFormChange={handleBannerFormChange}
        handleBannerImageChange={handleBannerImageChange}
        bannerImageFile={bannerImageFile}
      />
    </div>
  );
}

export default AdminDashboard;