import React, { useState, useEffect } from 'react';
import { Container, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { booksAPI, categoriesAPI, bannersAPI } from '../services/api';
import BookCard from '../components/BookCard';
import './Home.css';

function Home() {
  const [flashSaleBooks, setFlashSaleBooks] = useState([]);
  const [bestsellerBooks, setBestsellerBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch các dữ liệu trang chủ song song
      const [flashSale, bestsellers, newBooksData, featured, categoriesData, bannersData] = await Promise.all([
        booksAPI.getBooks({ limit: 6, sort: '-discountPercent' }),
        booksAPI.getBestsellers().catch(() => booksAPI.getBooks({ limit: 6, sort: '-soldCount' })),
        booksAPI.getBooks({ limit: 6, sort: '-createdAt' }),
        booksAPI.getFeaturedBooks().catch(() => booksAPI.getBooks({ limit: 6, featured: true })),
        categoriesAPI.getCategories(),
        bannersAPI.getBanners().catch(() => ({ data: { data: { banners: [] } } }))
      ]);

      setFlashSaleBooks(flashSale.data?.data?.books || flashSale.data?.books || []);
      setBestsellerBooks(bestsellers.data?.data?.books || bestsellers.data?.books || []);
      setNewBooks(newBooksData.data?.data?.books || newBooksData.data?.books || []);
      setFeaturedBooks(featured.data?.data?.books || featured.data?.books || []);
      setCategories(categoriesData.data?.data?.categories || categoriesData.data?.categories || []);
      setBanners(bannersData.data?.data?.banners || bannersData.data?.banners || []);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookCard = (book) => (
    <BookCard key={book._id} book={book} />
  );

  return (
    <div className="home-page">
      {/* Banner Carousel */}
      <Container className="mb-4">
        <Carousel className="banner-carousel">
          {banners && banners.length > 0 ? (
            banners.map((banner) => {
              const slideContent = (
                <div 
                  className="banner-slide" 
                  style={{ 
                    backgroundImage: `url(${banner.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: banner.linkUrl ? 'pointer' : 'default'
                  }}
                >
                  {(banner.title?.trim() || banner.subtitle?.trim()) && (
                    <div className="text-center text-white p-3" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', maxWidth: '80%' }}>
                      {banner.title?.trim() && <h1 className="display-5 fw-bold mb-2">{banner.title}</h1>}
                      {banner.subtitle?.trim() && <p className="lead fs-5 mb-0">{banner.subtitle}</p>}
                    </div>
                  )}
                </div>
              );

              return (
                <Carousel.Item key={banner._id}>
                  {banner.linkUrl ? (
                    <Link to={banner.linkUrl} style={{ textDecoration: 'none', display: 'block' }}>
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </Carousel.Item>
              );
            })
          ) : (
            <>
              <Carousel.Item>
                <div className="banner-slide" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '500px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="text-center text-white">
                    <h1 className="display-4 fw-bold mb-3">Chào mừng đến Zera Books</h1>
                    <p className="lead">Khám phá hàng ngàn sản phẩm chất lượng</p>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="banner-slide" style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  height: '500px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="text-center text-white">
                    <h1 className="display-4 fw-bold mb-3">Giảm giá lên đến 50%</h1>
                    <p className="lead">Cho các sản phẩm bestseller</p>
                  </div>
                </div>
              </Carousel.Item>
            </>
          )}
        </Carousel>
      </Container>

      {/* Shopee-style Category Grid */}
      <Container className="mb-4">
        <div className="category-section-shopee">
          <h3 className="category-section-title">DANH MỤC</h3>
          <div className="category-grid-shopee">
            {categories.map((cat) => {
              // Map categories to FontAwesome icons
              let iconClass = 'fa-folder-open';
              let gradientClass = 'grad-default';
              
              if (cat.categoryName.includes('Sách tiếng Việt')) {
                iconClass = 'fa-book-open';
                gradientClass = 'grad-sachviet';
              } else if (cat.categoryName.includes('Sách ngoại văn')) {
                iconClass = 'fa-globe';
                gradientClass = 'grad-sachngoai';
              } else if (cat.categoryName.includes('Gói quà')) {
                iconClass = 'fa-gift';
                gradientClass = 'grad-goiqua';
              } else if (cat.categoryName.includes('Bút viết')) {
                iconClass = 'fa-pen-nib';
                gradientClass = 'grad-but';
              } else if (cat.categoryName.includes('Dụng cụ học sinh')) {
                iconClass = 'fa-paperclip';
                gradientClass = 'grad-vanphong';
              } else if (cat.categoryName.includes('Họa cụ')) {
                iconClass = 'fa-palette';
                gradientClass = 'grad-hoacu';
              } else if (cat.categoryName.includes('Đồ thủ công')) {
                iconClass = 'fa-scissors';
                gradientClass = 'grad-thucong';
              } else if (cat.categoryName.includes('Sổ và giấy')) {
                iconClass = 'fa-file-signature';
                gradientClass = 'grad-so';
              } else if (cat.categoryName.includes('Quà lưu niệm')) {
                iconClass = 'fa-shapes';
                gradientClass = 'grad-souvenir';
              } else if (cat.categoryName.includes('Nhạc cụ')) {
                iconClass = 'fa-music';
                gradientClass = 'grad-music';
              }
              
              return (
                <Link to={`/books?category=${cat._id}`} className="category-item-shopee" key={cat._id}>
                  <div className={`category-icon-shopee ${gradientClass}`}>
                    <i className={`fa-solid ${iconClass}`}></i>
                  </div>
                  <span className="category-name-shopee">{cat.categoryName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>

      <Container>
        {/* Flash Sale Section */}
        <div className="homepage-section">
          <div className="section-title hot-category">
            <h2>
              <i className="fa-solid fa-bolt"></i>
              FLASH SALE - GIẢM GIÁ SỐC
            </h2>
            <Link to="/books/sale" className="view-all-link">
              Xem tất cả <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
          <div className="product-grid">
            {loading ? (
              <div className="text-center w-100">Đang tải...</div>
            ) : (
              flashSaleBooks.map(renderBookCard)
            )}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="homepage-section">
          <div className="section-title hot-category">
            <h2>
              <i className="fa-solid fa-fire"></i>
              SẢN PHẨM BÁN CHẠY
            </h2>
            <Link to="/books/bestsellers" className="view-all-link">
              Xem tất cả <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
          <div className="product-grid">
            {loading ? (
              <div className="text-center w-100">Đang tải...</div>
            ) : (
              bestsellerBooks.map(renderBookCard)
            )}
          </div>
        </div>

        {/* New Books Section */}
        <div className="homepage-section">
          <div className="section-title cool-category">
            <h2>
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              SẢN PHẨM MỚI
            </h2>
            <Link to="/books/new" className="view-all-link">
              Xem tất cả <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
          <div className="product-grid">
            {loading ? (
              <div className="text-center w-100">Đang tải...</div>
            ) : (
              newBooks.map(renderBookCard)
            )}
          </div>
        </div>

        {/* Featured Books Section */}
        <div className="homepage-section">
          <div className="section-title cool-category">
            <h2>
              <i className="fa-solid fa-crown"></i>
              SẢN PHẨM NỔI BẬT
            </h2>
            <Link to="/books/featured" className="view-all-link">
              Xem tất cả <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
          <div className="product-grid">
            {loading ? (
              <div className="text-center w-100">Đang tải...</div>
            ) : (
              featuredBooks.map(renderBookCard)
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Home;
