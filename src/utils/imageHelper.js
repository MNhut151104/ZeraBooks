export const getCategoryFallbackImage = (product) => {
  const catName = typeof product?.category === 'object'
    ? (product.category.categoryName || product.category.name || '')
    : (product?.category || '');

  const title = product?.bookTitle || product?.name || product?.title || '';
  const textToLower = (String(catName) + ' ' + String(title)).toLowerCase();

  if (textToLower.includes('ngoại văn')) return '/images/sach_ngoai_van/default.jpg';
  if (textToLower.includes('bút')) return '/images/but_viet/default.jpg';
  if (textToLower.includes('gói quà') || textToLower.includes('quà tặng') || textToLower.includes('túi giấy')) return '/images/goi_qua/default.jpg';
  if (textToLower.includes('văn phòng') || textToLower.includes('học sinh') || textToLower.includes('kẹp bướm') || textToLower.includes('kẹp') || textToLower.includes('deli')) return '/images/dung_cu_hoc_sinh_van_phong/default.jpg';
  if (textToLower.includes('họa cụ') || textToLower.includes('màu')) return '/images/hoa_cu/default.jpg';
  if (textToLower.includes('thủ công')) return '/images/do_thu_cong/default.jpg';
  if (textToLower.includes('sổ') || textToLower.includes('giấy')) return '/images/so_va_giay_cac_loai/default.jpg';
  if (textToLower.includes('lưu niệm')) return '/images/qua_luu_niem/default.jpg';
  if (textToLower.includes('nhạc cụ') || textToLower.includes('âm nhạc') || textToLower.includes('guitar') || textToLower.includes('capo') || textToLower.includes('đàn')) return '/images/nhac_cu_va_phu_kien_am_nhac/default.jpg';
  if (textToLower.includes('tiếng việt') || textToLower.includes('sách') || textToLower.includes('truyện')) return '/images/sach_tieng_viet/default.jpg';

  return '/images/books/default.jpg';
};

export const getDefaultProductImage = (product, isFallback = false) => {
  if (!isFallback && product?.imageUrl && product.imageUrl !== '/images/books/default.jpg' && product.imageUrl !== '/images/default-book.jpg') {
    return product.imageUrl;
  }
  return getCategoryFallbackImage(product);
};

