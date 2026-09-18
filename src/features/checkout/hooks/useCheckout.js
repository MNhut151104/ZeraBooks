import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { ordersAPI } from '../../../services/api';

export function useCheckout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    note: '',
    paymentMethod: 'COD'
  });

  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Auto-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        district: user.district || ''
      }));
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const subtotal = getCartTotal();
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0[35789][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.city) {
      newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.district) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const orderDetails = cartItems.map(item => ({
          book: item.book._id,
          quantity: item.quantity,
          unitPrice: item.book.price,
          discountPercent: item.book.discountPercent || 0
        }));

        const orderData = {
          shippingName: formData.fullName,
          shippingPhone: formData.phone,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingDistrict: formData.district,
          paymentMethod: formData.paymentMethod,
          notes: formData.note,
          orderDetails: orderDetails
        };

        const response = await ordersAPI.createOrder(orderData);
        const createdOrder = response.data?.data?.order || response.data?.order;

        clearCart();

        const orderStateData = {
          orderNumber: createdOrder.orderNumber,
          orderId: createdOrder._id,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.district}, ${formData.city}`,
          paymentMethod: formData.paymentMethod,
          total: total,
          items: cartItems
        };

        if (formData.paymentMethod === 'COD') {
          navigate('/order-success', { state: orderStateData });
        } else {
          navigate('/payment-qr', { state: orderStateData });
        }
      } catch (error) {
        console.error('Error creating order:', error);
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
        alert(errorMessage);
      }
    }
  };

  const paymentMethods = [
    {
      id: 'COD',
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: 'fas fa-money-bill-wave',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng'
    },
    {
      id: 'BANK',
      name: 'Chuyển khoản ngân hàng',
      icon: 'fas fa-university',
      description: 'Chuyển khoản qua Internet Banking'
    },
    {
      id: 'CARD',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: 'fas fa-credit-card',
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'MOMO',
      name: 'Ví MoMo',
      icon: 'fas fa-wallet',
      description: 'Thanh toán qua ví điện tử MoMo'
    },
    {
      id: 'ZALOPAY',
      name: 'ZaloPay',
      icon: 'fas fa-mobile-alt',
      description: 'Thanh toán qua ví ZaloPay'
    }
  ];

  const cities = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông'
  ];

  const districts = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
    'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Thủ Đức', 'Bình Thạnh', 'Gò Vấp'
  ];

  return {
    formData,
    errors,
    subtotal,
    shippingFee,
    total,
    cartItems,
    cities,
    districts,
    paymentMethods,
    handleInputChange,
    handleSubmit,
    formatPrice
  };
}
