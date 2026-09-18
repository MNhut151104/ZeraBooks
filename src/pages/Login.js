import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email hoặc tên đăng nhập';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          if (formData.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          
          // Điều hướng dựa trên loại user
          if (result.data.type === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          setErrors({ submit: result.error });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
        setErrors({ submit: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng trở lại với Zera Books</p>
          </div>

          <div className="login-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email / Tên đăng nhập</label>
                <div className="input-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email hoặc tên đăng nhập"
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="remember-forgot">
                <label>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>

              {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div className="divider">
                <span>Hoặc</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google">
                  <i className="fab fa-google"></i>
                  Đăng nhập với Google
                </button>
                <button type="button" className="social-btn facebook">
                  <i className="fab fa-facebook-f"></i>
                  Đăng nhập với Facebook
                </button>
              </div>

              <div className="signup-link">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </div>
            </form>
          </div>
        </div>

        <div className="back-home-link">
          <Link to="/">
            <i className="fas fa-arrow-left"></i>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
