import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { booksAPI, categoriesAPI } from '../services/api';
import BookCard from '../components/BookCard';
import './Books.css';

function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => (opt.id !== undefined ? opt.id : opt.value) === value) || options[0];
  const selectedLabel = selectedOption ? (selectedOption.name || selectedOption.label) : '';

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <i className={`fas fa-chevron-down select-arrow ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="custom-select-menu">
          {options.map((option) => {
            const optValue = option.id !== undefined ? option.id : option.value;
            const optLabel = option.name || option.label;
            const isSelected = optValue === value;

            return (
              <div
                key={optValue}
                className={`custom-select-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
              >
                <span>{optLabel}</span>
                {isSelected && <i className="fas fa-check check-icon"></i>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Books() {
  const location = useLocation();
  const { section } = useParams(); // new, bestsellers, sale
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('bestseller');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [availableGenres, setAvailableGenres] = useState([]);

  // Fetch dynamic genres from database
  useEffect(() => {
    const fetchAvailableGenres = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category') || 'all';
        const params = { limit: 200 };
        if (categoryParam && categoryParam !== 'all') {
          params.category = categoryParam;
        }
        const res = await booksAPI.getBooks(params);
        const allCategoryBooks = res.data?.data?.books || res.data?.books || [];
        const genres = Array.from(new Set(allCategoryBooks.map(b => b.genre).filter(Boolean)));
        
        // If DB has genres, use them; otherwise fallback to standard genres
        if (genres.length > 0) {
          setAvailableGenres(genres);
        } else {
          setAvailableGenres(['Văn học', 'Kinh tế', 'Kỹ năng sống', 'Thiếu nhi', 'Khoa học', 'Tâm lý']);
        }
      } catch (err) {
        console.error('Error fetching dynamic genres:', err);
        setAvailableGenres(['Văn học', 'Kinh tế', 'Kỹ năng sống', 'Thiếu nhi', 'Khoa học', 'Tâm lý']);
      }
    };
    fetchAvailableGenres();
  }, [location.search, section]);

  const genreOptions = [
    { value: 'all', label: 'Tất cả thể loại' },
    ...availableGenres.map(g => ({ value: g, label: g }))
  ];

  const sortOptions = [
    { value: 'bestseller', label: 'Bán chạy nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'rating', label: 'Đánh giá cao' }
  ];

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch books khi filters thay đổi
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category') || 'all';
    
    setSelectedCategory(categoryParam);
    setCurrentSection(section || null);
    
    fetchBooks(categoryParam, section);
  }, [location.search, section, sortBy, priceRange, selectedGenre]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data?.data?.categories || response.data?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async (catParam, secParam) => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {
        limit: 50,
        sort: sortBy === 'bestseller' ? '-soldCount' :
              sortBy === 'newest' ? '-createdAt' :
              sortBy === 'price-desc' ? '-price' :
              sortBy === 'price-asc' ? 'price' :
              sortBy === 'rating' ? '-averageRating' : '-createdAt'
      };

      // Add category filter
      if (catParam && catParam !== 'all') {
        params.category = catParam;
        console.log('Filtering by category:', catParam);
      }

      // Add genre filter
      if (selectedGenre && selectedGenre !== 'all') {
        params.genre = selectedGenre;
      }

      // Add price range filter
      if (priceRange !== 'all') {
        if (priceRange === '0-50') {
          params.maxPrice = 50000;
        } else if (priceRange === '50-100') {
          params.minPrice = 50000;
          params.maxPrice = 100000;
        } else if (priceRange === '100-200') {
          params.minPrice = 100000;
          params.maxPrice = 200000;
        } else if (priceRange === '200-up') {
          params.minPrice = 200000;
        }
      }

      // Fetch theo section
      let response;
      if (secParam === 'bestsellers') {
        response = await booksAPI.getBestsellers().catch(() => 
          booksAPI.getBooks({ ...params, sort: '-soldCount' })
        );
      } else if (secParam === 'featured') {
        response = await booksAPI.getFeaturedBooks().catch(() => 
          booksAPI.getBooks({ ...params, featured: true })
        );
      } else {
        console.log('Fetching books with params:', params);
        response = await booksAPI.getBooks(params);
      }

      console.log('Books response:', response.data);
    
    // Response structure: { data: { books: [...] } }
    const booksData = response.data?.data?.books || response.data?.books || [];
    console.log('Books data:', booksData);
    console.log('Is array?', Array.isArray(booksData));
    setBooks(Array.isArray(booksData) ? booksData : []);
  } catch (error) {
    console.error('Error fetching books:', error);
    setBooks([]);
  } finally {
    setLoading(false);
  }
};

  const priceRanges = [
    { id: 'all', name: 'Tất cả giá' },
    { id: '0-50', name: 'Dưới 50.000đ' },
    { id: '50-100', name: '50.000đ - 100.000đ' },
    { id: '100-200', name: '100.000đ - 200.000đ' },
    { id: '200-up', name: 'Trên 200.000đ' }
  ];

  // Lấy tên danh mục hiện tại
  const getCurrentCategoryName = () => {
    // Nếu đang ở section đặc biệt
    if (currentSection === 'new') return 'Sản phẩm mới';
    if (currentSection === 'bestsellers') return 'Sản phẩm bán chạy';
    if (currentSection === 'sale') return 'Sản phẩm giảm giá sốc';
    if (currentSection === 'featured') return 'Sản phẩm nổi bật';
    
    // Nếu đang ở category
    const category = categories.find(cat => cat._id === selectedCategory);
    return category ? category.categoryName : 'Danh mục sản phẩm';
  };

  const currentCat = categories.find(cat => cat._id === selectedCategory);
  const isBookCategory = currentCat && (currentCat.categoryName.includes('Sách tiếng Việt') || currentCat.categoryName.includes('Sách ngoại văn'));

  return (
    <div className="books-page">
      <div className="container">
        {/* Tiêu đề danh mục và Filter/Sort */}
        <div className="header-with-filters">
          <div className="category-title-section">
            <h1 className="category-title">
              <i className="fas fa-book"></i> {getCurrentCategoryName()}
            </h1>
            <div className="custom-breadcrumb">
              <Link to="/">Trang chủ</Link>
              <i className="fas fa-chevron-right"></i>
              <span>{getCurrentCategoryName()}</span>
            </div>
          </div>

          {/* Filter và Sort toolbar */}
          <div className="filter-sort-toolbar">
            {isBookCategory && (
              <div className="filter-item-section">
                <label className="toolbar-label">
                  <i className="fas fa-book-open"></i> Thể loại:
                </label>
                <CustomSelect
                  value={selectedGenre}
                  options={genreOptions}
                  onChange={(val) => setSelectedGenre(val)}
                />
              </div>
            )}
            <div className="filter-item-section">
              <label className="toolbar-label">
                <i className="fas fa-filter"></i> Lọc giá:
              </label>
              <CustomSelect
                value={priceRange}
                options={priceRanges}
                onChange={(val) => setPriceRange(val)}
              />
            </div>
            
            <div className="filter-item-section">
              <label className="toolbar-label">
                <i className="fas fa-sort"></i> Sắp xếp:
              </label>
              <CustomSelect
                value={sortBy}
                options={sortOptions}
                onChange={(val) => setSortBy(val)}
              />
            </div>
          </div>
        </div>

        {/* Main Content - Danh sách sách */}
        <main className="books-main">
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Đang tải sách...</p>
            </div>
          ) : (
            <div className="books-grid">
              {books.length === 0 ? (
                <div className="no-books-message">
                  <i className="fas fa-book-open"></i>
                  <p>Không tìm thấy sản phẩm nào phù hợp</p>
                </div>
              ) : (
                books.map(book => (
                  <BookCard key={book._id} book={book} />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Books;
