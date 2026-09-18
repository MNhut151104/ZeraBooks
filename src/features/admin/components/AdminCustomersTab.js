import React, { useState } from 'react';

export function AdminCustomersTab({ customers, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const fullName = (customer.fullName || '').toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const phone = (customer.phone || '').toLowerCase();
    const city = (customer.city || '').toLowerCase();
    const address = (customer.address || customer.streetAddress || '').toLowerCase();
    const statusStr = customer.isActive ? 'hoạt động' : 'khóa';

    return fullName.includes(term) || 
           email.includes(term) || 
           phone.includes(term) || 
           city.includes(term) || 
           address.includes(term) || 
           statusStr.includes(term);
  });

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Quản lý khách hàng ({filteredCustomers.length}{searchTerm ? ` / ${customers.length}` : ''})</h2>
        
        <div className="admin-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm theo tên, email, SĐT, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="admin-search-clear" onClick={() => setSearchTerm('')} title="Xóa tìm kiếm">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-results">
                    <i className="fa-solid fa-users-slash"></i>
                    {searchTerm 
                      ? `Không tìm thấy khách hàng nào phù hợp với từ khóa "${searchTerm}"`
                      : 'Chưa có khách hàng nào'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer._id || index}>
                    <td><strong>{customer.fullName}</strong></td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.city}</td>
                    <td>
                      <span className={`status-badge ${customer.isActive ? 'active' : 'inactive'}`}>
                        {customer.isActive ? 'Hoạt động' : 'Khóa'}
                      </span>
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
