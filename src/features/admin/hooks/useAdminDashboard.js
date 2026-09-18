import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

export function useAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalBooks: 0,
    totalRevenue: 0
  });

  // Data states
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Banner Modal states
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    order: 0,
    isActive: true
  });

  // Modal states
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    brand: '',
    origin: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    imageUrl: '',
    publishedYear: '',
    pageCount: '',
    language: 'Tiếng Việt',
    coverType: '',
    genre: '',
    isbn: '',
    material: '',
    color: '',
    dimensions: '',
    tipSize: '',
    paperWeight: '',
    rulingType: '',
    weight: '',
    safetyWarning: '',
    isFeatured: false
  });

  useEffect(() => {
    if (!user || user.type !== 'admin') {
      navigate('/login');
      return;
    }

    fetchStats();
    fetchData();
    localStorage.setItem('adminActiveTab', activeTab);
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }, [user, navigate, activeTab, sidebarCollapsed]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [booksRes, ordersRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books?showAll=true', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { data: { orders: [] } } })),
        axios.get('http://localhost:5000/api/customers', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { data: { customers: [] } } }))
      ]);

      const orders = ordersRes.data.data?.orders || [];
      const totalRevenue = orders.reduce((sum, order) =>
        sum + (order.totalAmount || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalCustomers: customersRes.data.data?.customers?.length || 0,
        totalBooks: booksRes.data.data?.pagination?.total !== undefined 
          ? booksRes.data.data.pagination.total 
          : (booksRes.data.data?.books?.length || 0),
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      switch (activeTab) {
        case 'books':
          const [booksRes, categoriesRes] = await Promise.all([
            axios.get('http://localhost:5000/api/books?showAll=true', config),
            axios.get('http://localhost:5000/api/categories')
          ]);
          setBooks(booksRes.data.data?.books || []);
          setCategories(categoriesRes.data.data?.categories || []);
          break;
        case 'orders':
          const ordersRes = await axios.get('http://localhost:5000/api/orders', config);
          setOrders(ordersRes.data.data?.orders || []);
          break;
        case 'customers':
          const customersRes = await axios.get('http://localhost:5000/api/customers', config);
          setCustomers(customersRes.data.data?.customers || []);
          break;
        case 'categories':
          const [categoriesRes2, booksRes2] = await Promise.all([
            axios.get('http://localhost:5000/api/categories'),
            axios.get('http://localhost:5000/api/books?showAll=true', config)
          ]);
          setCategories(categoriesRes2.data.data?.categories || []);
          setBooks(booksRes2.data.data?.books || []);
          break;
        case 'reviews':
          try {
            const reviewsRes = await axios.get('http://localhost:5000/api/reviews', config);
            const reviewsData = reviewsRes.data.data?.reviews || reviewsRes.data.reviews || [];
            setReviews(reviewsData);
          } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
          }
          break;
        case 'banners':
          try {
            const bannersRes = await axios.get('http://localhost:5000/api/banners?showAll=true', config);
            setBanners(bannersRes.data.data?.banners || []);
          } catch (error) {
            console.error('Error fetching banners:', error);
            setBanners([]);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sách này?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Đã xóa sách thành công!');
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa sách'));
    }
  };

  const handleOpenBookModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookFormData({
        title: book.name || book.title || book.bookTitle || '',
        author: book.author || '',
        publisher: book.publisher || '',
        brand: book.brand || '',
        origin: book.origin || '',
        category: book.category?._id || book.categoryId || '',
        price: book.price !== undefined ? book.price : '',
        originalPrice: book.originalPrice !== undefined ? book.originalPrice : (book.salePrice || ''),
        stock: book.stockQuantity !== undefined ? book.stockQuantity : (book.stock !== undefined ? book.stock : ''),
        description: book.description || '',
        imageUrl: book.imageUrl || '',
        publishedYear: book.publishYear || book.publishedYear || '',
        pageCount: book.pageCount || '',
        language: book.bookLanguage || book.language || 'Tiếng Việt',
        coverType: book.coverType || '',
        genre: book.genre || '',
        isbn: book.isbn || '',
        material: book.material || book.coverMaterial || '',
        color: book.color || book.inkColor || '',
        dimensions: book.dimensions || book.paperSize || '',
        tipSize: book.tipSize || '',
        paperWeight: book.paperWeight || '',
        rulingType: book.rulingType || '',
        weight: book.weight || '',
        safetyWarning: book.safetyWarning || '',
        isFeatured: Boolean(book.isFeatured)
      });
    } else {
      setEditingBook(null);
      setBookFormData({
        title: '',
        author: '',
        publisher: '',
        brand: '',
        origin: '',
        category: '',
        price: '',
        originalPrice: '',
        stock: '',
        description: '',
        imageUrl: '',
        publishedYear: '',
        pageCount: '',
        language: 'Tiếng Việt',
        coverType: '',
        genre: '',
        isbn: '',
        material: '',
        color: '',
        dimensions: '',
        tipSize: '',
        paperWeight: '',
        rulingType: '',
        weight: '',
        safetyWarning: '',
        isFeatured: false
      });
    }
    setShowBookModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
    setEditingBook(null);
    setImageFile(null);
  };

  const handleBookFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('Kích thước file không được vượt quá 500KB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        name: bookFormData.title,
        bookTitle: bookFormData.title,
        title: bookFormData.title,
        categoryId: bookFormData.category || undefined,
        price: Number(bookFormData.price) || 0,
        originalPrice: bookFormData.originalPrice ? Number(bookFormData.originalPrice) : undefined,
        stockQuantity: Number(bookFormData.stock) || 0,
        stock: Number(bookFormData.stock) || 0,
        author: bookFormData.author || '',
        publisher: bookFormData.publisher || '',
        brand: bookFormData.brand || '',
        origin: bookFormData.origin || '',
        description: bookFormData.description || '',
        publishYear: bookFormData.publishedYear ? Number(bookFormData.publishedYear) : undefined,
        publishedYear: bookFormData.publishedYear ? Number(bookFormData.publishedYear) : undefined,
        pageCount: bookFormData.pageCount ? Number(bookFormData.pageCount) : undefined,
        bookLanguage: bookFormData.language || 'Tiếng Việt',
        language: bookFormData.language || 'Tiếng Việt',
        coverType: bookFormData.coverType || '',
        genre: bookFormData.genre || '',
        isbn: bookFormData.isbn || '',
        material: bookFormData.material || '',
        coverMaterial: bookFormData.material || '',
        color: bookFormData.color || '',
        inkColor: bookFormData.color || '',
        dimensions: bookFormData.dimensions || '',
        paperSize: bookFormData.dimensions || '',
        tipSize: bookFormData.tipSize || '',
        paperWeight: bookFormData.paperWeight || '',
        rulingType: bookFormData.rulingType || '',
        weight: bookFormData.weight ? Number(bookFormData.weight) : undefined,
        safetyWarning: bookFormData.safetyWarning || '',
        isFeatured: Boolean(bookFormData.isFeatured)
      };

      let bookData;

      if (editingBook) {
        const response = await axios.put(
          `http://localhost:5000/api/books/${editingBook._id}`,
          payload,
          config
        );
        bookData = response.data.data?.book;

        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          const uploadResponse = await axios.post(
            `http://localhost:5000/api/books/${editingBook._id}/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          bookData.imageUrl = uploadResponse.data.data?.imageUrl || uploadResponse.data.imageUrl;
        }

        setBooks(prevBooks => prevBooks.map(book =>
          book._id === editingBook._id ? { ...book, ...bookData } : book
        ));
        alert('Cập nhật sản phẩm thành công!');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/books',
          payload,
          config
        );
        bookData = response.data.data?.book;

        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          const uploadResponse = await axios.post(
            `http://localhost:5000/api/books/${bookData._id}/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          bookData.imageUrl = uploadResponse.data.data?.imageUrl || uploadResponse.data.imageUrl;
        }

        setBooks(prevBooks => [bookData, ...prevBooks]);
        alert('Thêm sản phẩm thành công!');
      }
      handleCloseBookModal();
      fetchStats();
    } catch (error) {
      console.error('Error saving book:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu sản phẩm');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Đã xóa đánh giá thành công!');
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa đánh giá'));
    }
  };

  // BANNER HANDLERS
  const handleOpenBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        linkUrl: banner.linkUrl || '',
        order: banner.order !== undefined ? banner.order : 0,
        isActive: banner.isActive !== undefined ? banner.isActive : true
      });
    } else {
      setEditingBanner(null);
      setBannerFormData({
        title: '',
        subtitle: '',
        linkUrl: '',
        order: banners.length,
        isActive: true
      });
    }
    setBannerImageFile(null);
    setShowBannerModal(true);
  };

  const handleCloseBannerModal = () => {
    setShowBannerModal(false);
    setEditingBanner(null);
    setBannerImageFile(null);
  };

  const handleBannerFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      setBannerImageFile(file);
    }
  };

  const handleSubmitBanner = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let bannerData;

      if (editingBanner) {
        const response = await axios.put(
          `http://localhost:5000/api/banners/${editingBanner._id}`,
          bannerFormData,
          config
        );
        bannerData = response.data.data?.banner;

        if (bannerImageFile) {
          const formData = new FormData();
          formData.append('image', bannerImageFile);
          const uploadResponse = await axios.post(
            `http://localhost:5000/api/banners/${editingBanner._id}/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          bannerData.imageUrl = uploadResponse.data.data?.imageUrl || uploadResponse.data.imageUrl;
        }

        setBanners(prevBanners => prevBanners.map(b =>
          b._id === editingBanner._id ? { ...b, ...bannerData } : b
        ));
        alert('Cập nhật Banner thành công!');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/banners',
          bannerFormData,
          config
        );
        bannerData = response.data.data?.banner;

        if (bannerImageFile) {
          const formData = new FormData();
          formData.append('image', bannerImageFile);
          const uploadResponse = await axios.post(
            `http://localhost:5000/api/banners/${bannerData._id}/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          bannerData.imageUrl = uploadResponse.data.data?.imageUrl || uploadResponse.data.imageUrl;
        }

        setBanners(prevBanners => [bannerData, ...prevBanners]);
        alert('Thêm Banner thành công!');
      }
      handleCloseBannerModal();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error.response?.data?.message || 'Lỗi khi lưu banner');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/banners/${bannerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Đã xóa banner thành công!');
      setBanners(prevBanners => prevBanners.filter(b => b._id !== bannerId));
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa banner'));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Đã cập nhật trạng thái đơn hàng!');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    user,
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    stats,
    books,
    setBooks,
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
    handleUpdateOrderStatus,
    formatPrice,
    formatDate
  };
}
