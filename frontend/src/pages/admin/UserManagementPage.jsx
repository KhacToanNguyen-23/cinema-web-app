import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const UserManagementPage = () => {
  const { user } = useAuth(); // To check if current user is ADMIN
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'MEMBER'
  });
  
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        password: '', // Don't show password
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'MEMBER'
      });
    } else {
      setFormData({
        id: null,
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'MEMBER'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update
        await userApi.updateUser(formData.id, formData);
        alert('Cập nhật người dùng thành công!');
      } else {
        // Create
        if (!formData.password) {
          alert('Vui lòng nhập mật khẩu cho người dùng mới');
          return;
        }
        await userApi.createUser(formData);
        alert('Thêm người dùng thành công!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userApi.deleteUser(id);
        alert('Xóa thành công!');
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert('Lỗi khi xóa người dùng');
      }
    }
  };

  return (
    <div className="p-6 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Người Dùng</h1>
        {isAdmin && (
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-colors"
          >
            + Thêm Người Dùng
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="p-4 font-semibold text-gray-300">ID</th>
                <th className="p-4 font-semibold text-gray-300">Tên đăng nhập</th>
                <th className="p-4 font-semibold text-gray-300">Họ tên</th>
                <th className="p-4 font-semibold text-gray-300">Email</th>
                <th className="p-4 font-semibold text-gray-300">Vai trò</th>
                {isAdmin && <th className="p-4 font-semibold text-gray-300 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="p-4">{u.id}</td>
                  <td className="p-4 font-medium">{u.username}</td>
                  <td className="p-4">{u.fullName || '-'}</td>
                  <td className="p-4">{u.email || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      u.role === 'ADMIN' ? 'bg-red-900 text-red-200' :
                      u.role === 'MANAGER' ? 'bg-orange-900 text-orange-200' :
                      u.role === 'STAFF' ? 'bg-blue-900 text-blue-200' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(u)} className="text-blue-400 hover:text-blue-300 transition-colors">Sửa</button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-300 transition-colors">Xóa</button>
                    </td>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-gray-500">
                    Không có dữ liệu người dùng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Sửa Người Dùng' : 'Thêm Người Dùng'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="username" value={formData.username} onChange={handleChange}
                  disabled={!!formData.id}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mật khẩu {formData.id ? '(Để trống nếu không đổi)' : <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input 
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select 
                  name="role" value={formData.role} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="MEMBER">MEMBER (Khách hàng)</option>
                  <option value="STAFF">STAFF (Nhân viên)</option>
                  <option value="MANAGER">MANAGER (Quản lý rạp)</option>
                  <option value="ADMIN">ADMIN (Quản trị hệ thống)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
