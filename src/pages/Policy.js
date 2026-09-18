import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import './Policy.css';

function Policy({ type: defaultType }) {
  const { type: pathType } = useParams();
  const navigate = useNavigate();

  const activeTab = pathType || defaultType || 'shipping';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleSelectTab = (selectedKey) => {
    if (selectedKey === 'terms') {
      navigate('/terms');
    } else {
      navigate(`/policy/${selectedKey}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'shipping':
        return (
          <div className="policy-section-content">
            <h2 className="policy-title">
              <i className="fa-solid fa-truck-fast me-2 text-primary"></i>
              Chính Sách Vận Chuyển
            </h2>
            <p className="policy-intro">
              Zera Books luôn nỗ lực mang đến dịch vụ giao hàng nhanh chóng, an toàn và chuyên nghiệp nhất đến tận tay quý khách hàng trên toàn quốc.
            </p>

            <div className="policy-card">
              <h4>1. Phạm vi giao hàng</h4>
              <p>Zera Books hỗ trợ giao hàng tới tất cả các tỉnh/thành phố trên toàn lãnh thổ Việt Nam thông qua các đối tác vận chuyển uy tín (Giao Hàng Nhanh, Viettel Post, VNPost, Ahamove...).</p>
            </div>

            <div className="policy-card">
              <h4>2. Thời gian giao hàng dự kiến</h4>
              <ul>
                <li><strong>Khu vực TP. Hồ Chí Minh:</strong> 1 - 2 ngày làm việc (Hỗ trợ giao hỏa tốc trong ngày nếu yêu cầu).</li>
                <li><strong>Các Tỉnh/Thành phố khác:</strong> 2 - 5 ngày làm việc tùy thuộc vào từng khu vực địa lý.</li>
              </ul>
              <p className="note-text"><i className="fa-solid fa-circle-info me-1"></i> Thời gian giao hàng không tính Chủ Nhật và các ngày Lễ, Tết theo quy định của Nhà nước.</p>
            </div>

            <div className="policy-card">
              <h4>3. Phí vận chuyển & Đơn hàng miễn phí</h4>
              <ul>
                <li><strong>Đơn hàng từ 300.000 VNĐ trở lên:</strong> MIỄN PHÍ VẬN CHUYỂN toàn quốc.</li>
                <li><strong>Đơn hàng dưới 300.000 VNĐ:</strong> Phí giao hàng đồng giá 30.000 VNĐ toàn quốc.</li>
              </ul>
            </div>

            <div className="policy-card">
              <h4>4. Quy định đồng kiểm (Kiểm tra hàng khi nhận)</h4>
              <p>Khách hàng được quyền mở gói hàng kiểm tra số lượng và tình trạng sách trước khi thanh toán cho nhân viên giao hàng. Nếu sách bị hư hỏng, rách mép hoặc không đúng đơn đặt hàng, quý khách có quyền từ chối nhận hàng và liên hệ ngay Hotline: <strong>0395511743</strong> để được hỗ trợ xử lý.</p>
            </div>
          </div>
        );

      case 'return':
        return (
          <div className="policy-section-content">
            <h2 className="policy-title">
              <i className="fa-solid fa-rotate-left me-2 text-primary"></i>
              Chính Sách Đổi Trả & Hoàn Tiền
            </h2>
            <p className="policy-intro">
              Để đảm bảo quyền lợi tối đa cho khách hàng, Zera Books áp dụng chính sách đổi trả sản phẩm dễ dàng và nhanh chóng.
            </p>

            <div className="policy-card">
              <h4>1. Thời hạn đổi trả</h4>
              <p>Quý khách có thể thực hiện đổi/trả sản phẩm trong vòng <strong>07 ngày</strong> kể từ ngày nhận hàng thành công (dựa theo dấu bưu điện hoặc xác nhận từ đơn vị giao vận).</p>
            </div>

            <div className="policy-card">
              <h4>2. Điều kiện chấp nhận đổi trả</h4>
              <ul>
                <li>Sách bị lỗi kỹ thuật từ Nhà xuất bản (thiếu trang, nhòe mực, đứt gáy, tráo trang).</li>
                <li>Sách bị hư hỏng, cong vênh hoặc thấm nước trong quá trình vận chuyển.</li>
                <li>Zera Books giao sai tên sách, sai số lượng hoặc thiếu quà tặng đi kèm so với đơn hàng đã đặt.</li>
                <li>Sách phải còn giữ nguyên tem, mác (nếu có) và chưa qua sử dụng, viết vẽ hay làm dơ bẩn.</li>
              </ul>
            </div>

            <div className="policy-card">
              <h4>3. Quy trình 3 bước đổi trả</h4>
              <ol>
                <li><strong>Bước 1:</strong> Chụp ảnh/Video clip sản phẩm bị lỗi cùng hóa đơn/phiếu giao hàng.</li>
                <li><strong>Bước 2:</strong> Gửi thông tin qua Email <strong>zerastudio151104@gmail.com</strong> hoặc Zalo/Hotline <strong>0395511743</strong>.</li>
                <li><strong>Bước 3:</strong> Sau khi xác nhận lỗi, Zera Books sẽ cử shipper đến thu hồi hàng và đổi sản phẩm mới MIỄN PHÍ toàn bộ chi phí phát sinh.</li>
              </ol>
            </div>

            <div className="policy-card">
              <h4>4. Phương thức hoàn tiền</h4>
              <p>Trong trường hợp sản phẩm hết hàng hoặc quý khách không có nhu cầu đổi sản phẩm khác, Zera Books sẽ hoàn lại 100% tiền qua chuyển khoản ngân hàng hoặc ví MoMo trong vòng 24 - 48 giờ làm việc.</p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="policy-section-content">
            <h2 className="policy-title">
              <i className="fa-solid fa-user-shield me-2 text-primary"></i>
              Chính Sách Bảo Mật Thông Tin
            </h2>
            <p className="policy-intro">
              Zera Books cam kết bảo vệ tuyệt đối sự riêng tư và thông tin cá nhân của quý khách hàng theo quy định của pháp luật Việt Nam.
            </p>

            <div className="policy-card">
              <h4>1. Mục đích thu thập thông tin</h4>
              <p>Chúng tôi chỉ thu thập các thông tin cần thiết phục vụ cho quá trình giao dịch bao gồm: Họ tên, Số điện thoại, Địa chỉ nhận hàng, Email. Thông tin này được sử dụng để:</p>
              <ul>
                <li>Xử lý và giao đơn hàng cho quý khách.</li>
                <li>Thông báo tình trạng đơn hàng và hỗ trợ chăm sóc khách hàng.</li>
                <li>Gửi thông tin khuyến mãi, sự kiện đặc biệt (chỉ khi có sự đồng ý của khách hàng).</li>
              </ul>
            </div>

            <div className="policy-card">
              <h4>2. Cam kết không chia sẻ dữ liệu</h4>
              <p>Zera Books cam kết <strong>KHÔNG</strong> bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được cung cấp duy nhất cho đối tác vận chuyển để thực hiện việc giao hàng.</p>
            </div>

            <div className="policy-card">
              <h4>3. An toàn bảo mật</h4>
              <p>Hệ thống của chúng tôi áp dụng mã hóa dữ liệu SSL và các chuẩn an ninh mạng tiên tiến nhằm ngăn chặn các hành vi truy cập trái phép, mất mát hoặc lạm dụng dữ liệu cá nhân.</p>
            </div>

            <div className="policy-card">
              <h4>4. Quyền lợi của khách hàng đối với dữ liệu</h4>
              <p>Quý khách có quyền đăng nhập vào tài khoản cá nhân để kiểm tra, cập nhật hoặc yêu cầu xóa bỏ thông tin cá nhân bất kỳ lúc nào trên hệ thống Zera Books.</p>
            </div>
          </div>
        );

      case 'terms':
      default:
        return (
          <div className="policy-section-content">
            <h2 className="policy-title">
              <i className="fa-solid fa-file-contract me-2 text-primary"></i>
              Điều Khoản Sử Dụng
            </h2>
            <p className="policy-intro">
              Khi truy cập và sử dụng dịch vụ tại Zera Books, quý khách đồng ý tuân thủ các quy định và điều khoản sử dụng dưới đây.
            </p>

            <div className="policy-card">
              <h4>1. Tài khoản người dùng</h4>
              <p>Khi đăng ký tài khoản tại Zera Books, quý khách có trách nhiệm bảo mật mật khẩu và thông tin đăng nhập của mình. Zera Books không chịu trách nhiệm cho các tổn thất phát sinh từ việc người dùng tiết lộ mật khẩu cho bên khác.</p>
            </div>

            <div className="policy-card">
              <h4>2. Quyền sở hữu trí tuệ</h4>
              <p>Toàn bộ nội dung, thiết kế, logo, văn bản, hình ảnh và mã nguồn trên website Zera Books đều thuộc quyền sở hữu của Zera Books hoặc đối tác xuất bản. Mọi hành vi sao chép, trích dẫn mà không có sự chấp thuận bằng văn bản đều bị cấm.</p>
            </div>

            <div className="policy-card">
              <h4>3. Giá cả và thanh toán</h4>
              <p>Giá niêm yết trên Zera Books là giá đã bao gồm thuế GTGT. Chúng tôi có quyền điều chỉnh giá bán và các chính sách ưu đãi mà không cần báo trước. Tuy nhiên, giá của đơn hàng đã được xác nhận thành công sẽ không thay đổi.</p>
            </div>

            <div className="policy-card">
              <h4>4. Thay đổi điều khoản</h4>
              <p>Zera Books có quyền chỉnh sửa, cập nhật Điều khoản sử dụng này vào bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải công khai trên website.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="policy-page">
      <Container className="py-5">
        <Row>
          <Col lg={3} className="mb-4">
            <Card className="policy-sidebar-card shadow-sm border-0">
              <Card.Header className="policy-sidebar-header">
                <h5 className="mb-0 font-weight-bold">
                  <i className="fa-solid fa-compass me-2"></i>
                  Trung tâm Chính sách
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav 
                  variant="pills" 
                  activeKey={activeTab} 
                  onSelect={handleSelectTab}
                  className="flex-column policy-nav"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="shipping">
                      <i className="fa-solid fa-truck-fast me-2"></i>
                      Vận chuyển & Giao hàng
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="return">
                      <i className="fa-solid fa-rotate-left me-2"></i>
                      Đổi trả & Hoàn tiền
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="privacy">
                      <i className="fa-solid fa-user-shield me-2"></i>
                      Bảo mật thông tin
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="terms">
                      <i className="fa-solid fa-file-contract me-2"></i>
                      Điều khoản sử dụng
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>

            <Card className="mt-4 policy-contact-card shadow-sm border-0">
              <Card.Body>
                <h6 className="fw-bold mb-3">Bạn cần hỗ trợ thêm?</h6>
                <p className="small text-muted mb-2">Đội ngũ CSKH Zera Books luôn sẵn sàng giải đáp thắc mắc của bạn.</p>
                <div className="contact-item small mb-2">
                  <i className="fa-solid fa-phone text-primary me-2"></i>
                  <strong>0395511743</strong>
                </div>
                <div className="contact-item small text-truncate">
                  <i className="fa-solid fa-envelope text-primary me-2"></i>
                  <span>zerastudio151104@gmail.com</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="policy-main-card shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                {renderContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Policy;
