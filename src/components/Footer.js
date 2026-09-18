import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="zera-footer">
      <Container>
        <Row className="footer-content">
          <Col md={4} className="footer-section">
            <h5 className="footer-title">VỀ ZERA BOOKS</h5>
            <p className="footer-desc">
              Zera Books - Nơi kết nối tri thức và đam mê đọc sách. 
              Chúng tôi cam kết mang đến những cuốn sách chất lượng 
              với giá cả hợp lý nhất.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
            </div>
          </Col>

          <Col md={4} className="footer-section">
            <h5 className="footer-title">CHÍNH SÁCH</h5>
            <ul className="footer-links">
              <li><Link to="/policy/shipping">Chính sách vận chuyển</Link></li>
              <li><Link to="/policy/return">Chính sách đổi trả</Link></li>
              <li><Link to="/policy/privacy">Chính sách bảo mật</Link></li>
              <li><Link to="/terms">Điều khoản sử dụng</Link></li>
            </ul>
          </Col>

          <Col md={4} className="footer-section">
            <h5 className="footer-title">LIÊN HỆ</h5>
            <ul className="footer-contact">
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <span>112/35 Đ.An Phú Đông, An Phú Đông, TP.HCM</span>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <span>Hotline: 0395511743</span>
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i>
                <span>zerastudio151104@gmail.com</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-payment">
          <div className="payment-title">Phương thức thanh toán:</div>
          <div className="payment-methods">
            <div className="payment-icon">
              <i className="fa-solid fa-money-bill-wave"></i>
              <span>COD</span>
            </div>
            <div className="payment-icon">
              <i className="fa-brands fa-cc-visa"></i>
              <span>Visa</span>
            </div>
            <div className="payment-icon">
              <i className="fa-brands fa-cc-mastercard"></i>
              <span>Mastercard</span>
            </div>
            <div className="payment-icon">
              <i className="fa-solid fa-wallet"></i>
              <span>MoMo</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Zera Books. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
